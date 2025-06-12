import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaSearch,
  FaChartBar,
  FaCreditCard,
  FaBriefcaseMedical,
} from "react-icons/fa";

const NurseDash = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    scheduledAppointments: 0,
    recentRequests: 0,
    monthlyAdmissions: 0,
  });

  const [requests, setRequests] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  // For modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = JSON.parse(localStorage.getItem("nurse"));
        if (!storedData) {
          Swal.fire(
            "Error",
            "Nurse information not found in localStorage.",
            "error"
          );
          return;
        }

        const { staff_id } = storedData;
        const today = new Date().toISOString().split("T")[0];
        const currentMonth = new Date().getMonth();

        // Fetch patients and appointments
        const patientResponse = await fetch("http://localhost:3001/patient/");
        const appointmentResponse = await fetch(
          "http://localhost:3001/appointment/"
        );
        const patientsData = await patientResponse.json();
        const appointmentsData = await appointmentResponse.json();

        setPatients(patientsData);

        const totalPatients = patientsData.length;

        const scheduledAppointments = appointmentsData.filter(
          (appt) => appt.status === "Scheduled" && appt.staff_id === staff_id
        ).length;

        const recentRequests = appointmentsData.filter((appt) => {
          return appt.status === "Pending" && appt.date_created?.startsWith(today);
        }).length;

        const monthlyAdmissions = patientsData.filter((p) => {
          const month = new Date(p.time_signed).getMonth();
          return month === currentMonth;
        }).length;

        const filteredRequests = appointmentsData.filter((appt) => {
          return (
            appt.status === "Pending" &&
            ["ultrasound", "maternity"].includes(appt.appointment_category)
          );
        });

        const filteredUpcoming = appointmentsData
          .filter(
            (appt) => appt.status === "Scheduled" && appt.staff_id === staff_id
          )
          .map((appt) => ({
            id: appt.appointment_id,
            patient:
              patientsData.find((p) => p.patient_id === appt.patient_id)?.name ||
              "Unknown",
            date: new Date(appt.date).toLocaleString(),
            type: appt.appointment_category,
          }));

        setStats({
          totalPatients,
          scheduledAppointments,
          recentRequests,
          monthlyAdmissions,
        });

        setRequests(filteredRequests);
        setUpcomingAppointments(filteredUpcoming);
      } catch (error) {
        console.error("Dashboard Load Error:", error);
        Swal.fire("Error", "Failed to load data", "error");
      }
    };

    fetchData();
  }, []);

  // Open modal on request click
  const openRequestModal = (request) => {
    setSelectedRequest(request);
    // Find patient by patient_id
    const patient = patients.find((p) => p.patient_id === request.patient_id);
    setSelectedPatient(patient || null);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedRequest(null);
    setSelectedPatient(null);
  };

  // Accept request handler
  const handleAccept = async () => {
    if (!selectedRequest) return;

    try {
      const storedData = JSON.parse(localStorage.getItem("nurse"));
      if (!storedData) {
        Swal.fire("Error", "Nurse information not found in localStorage.", "error");
        return;
      }
      const { staff_id } = storedData;

      // PATCH request to update status and staff_id
      const res = await fetch(
        `http://localhost:3001/appointment/patchy--update/${selectedRequest.appointment_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "Scheduled",
            staff_id,
            payment_status: "Pending",
            cost: selectedRequest.cost,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data.status === "200") {
        Swal.fire("Success", "Appointment accepted successfully", "success");
        closeModal();

        // Refresh dashboard data by re-fetching appointments and patients
        // Could refactor fetchData outside useEffect to call here, but quick:
        window.location.reload(); // Simple quick refresh — can optimize if needed
      } else {
        Swal.fire("Error", "Failed to update appointment", "error");
      }
    } catch (error) {
      console.error("Accept Error:", error);
      Swal.fire("Error", "Failed to accept request", "error");
    }
  };

  // Decline handler (just close modal or optionally update status)
  const handleDecline = () => {
    // Optionally add a PATCH here to update status to Declined if your API supports it
    closeModal();
  };

  // Helper function to calculate age from patient data
  // Assuming patient object has 'dob' or similar field — your data doesn't show this though
  // For demo, let's assume patient has 'dob' ISO string
  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    const ageDt = new Date(diff);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900">Maternity Dashboard</h1>
        <Link
          to="/signup_two"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Patient
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon="👩‍⚕️"
          color="bg-blue-100"
        />
        <StatCard
          title="Appointments"
          value={stats.scheduledAppointments}
          icon="📅"
          color="bg-green-100"
        />
        <StatCard
          title="Recent Requests"
          value={stats.recentRequests}
          icon="📨"
          color="bg-purple-100"
        />
        <StatCard
          title="Monthly Admissions"
          value={stats.monthlyAdmissions}
          icon="📈"
          color="bg-orange-100"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Requests</h2>
          <ul className="space-y-3">
            {requests.map((req) => (
              <li
                key={req.appointment_id}
                className="border p-3 rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => openRequestModal(req)}
              >
                <p className="font-medium">Patient ID: {req.patient_id}</p>
                <p className="text-sm text-gray-500">
                  Category: {req.appointment_category}
                </p>
                <p className="text-sm text-gray-500">Status: {req.status}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Upcoming Appointments
          </h2>
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Patient</th>
                <th className="pb-2">Date & Time</th>
                <th className="pb-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {upcomingAppointments.map((appointment) => (
                <tr key={appointment.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{appointment.patient}</td>
                  <td className="py-3">{appointment.date}</td>
                  <td className="py-3">
                    <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                      {appointment.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickAction title="Search Patient" icon={<FaSearch />} link="/search_patient" />
        <QuickAction title="View Reports" icon={<FaChartBar />} link="/reports_nurse" />
        <QuickAction
          title="Payment Records"
          icon={<FaCreditCard />}
          link="/payment_records_dash"
        />
        <QuickAction title="Sell Medicine" icon={<FaBriefcaseMedical />} link="/sell" />
      </div>

      {/* Modal */}
{modalOpen && selectedRequest && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
      <h3 className="text-xl font-semibold mb-4">Request Details</h3>
      <p>
        <strong>Patient ID:</strong> {selectedRequest.patient_id}
      </p>
      <p>
        <strong>Name:</strong>{" "}
        {selectedPatient
          ? `${selectedPatient.name || "N/A"} ${
              selectedPatient.surname || ""
            }`
          : "Loading..."}
      </p>
      <p>
        <strong>Age:</strong>{" "}
        {selectedPatient
          ? calculateAge(selectedPatient.dob)
          : "Loading..."}
      </p>
      <p>
        <strong>Category:</strong> {selectedRequest.appointment_category}
      </p>
      <p>
        <strong>Description:</strong> {selectedRequest.description}
      </p>
      <p>
        <strong>Status:</strong> {selectedRequest.status}
      </p>

      {/* Cost Input */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Appointment Cost ($)
        </label>
        <input
          type="number"
          value={selectedRequest.cost || ""}
          onChange={(e) =>
            setSelectedRequest((prev) => ({
              ...prev,
              cost: parseFloat(e.target.value),
            }))
          }
          min="0"
          className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={handleDecline}
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Accept
        </button>
      </div>

      <button
        onClick={closeModal}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg font-bold"
        aria-label="Close modal"
      >
        ×
      </button>
    </div>
  </div>
)}

    </div>
  );
};

// Reusable Stat Card
const StatCard = ({ title, value, icon, color }) => (
  <div className={`${color} p-4 rounded-xl`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

// Reusable Quick Action
const QuickAction = ({ title, icon, link }) => (
  <Link 
    to={link}
    className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="text-center">
      <span className="text-3xl block mb-2">{icon}</span>
      <p className="text-sm font-medium text-gray-700">{title}</p>
    </div>
  </Link>
);

export default NurseDash;
