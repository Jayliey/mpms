import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const DoctorDash = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    upcomingAppointments: 0,
    recentPayments: 0,
    monthlyAdmissions: 0,
  });

  const [recentPatients, setRecentPatients] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctor = JSON.parse(localStorage.getItem("doctor"));
        const staffId = doctor?.staff_id;

        const appointmentRes = await fetch(
          "http://localhost:3001/appointment/"
        );
        const appointments = await appointmentRes.json();

        const patientRes = await fetch("http://localhost:3001/patient/");
        const patients = await patientRes.json();

        const patientMap = {};
        patients.forEach((p) => {
          patientMap[p.patient_id] = `${p.name} ${p.surname}`;
        });

        const sortedAppointments = appointments
          .filter(
            (app) => app.status === "Scheduled" && app.staff_id === staffId
          )
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setStats({
          totalPatients: patients.length,
          upcomingAppointments: sortedAppointments.length,
          recentPayments: appointments.filter(
            (app) => app.payment_status === "Paid"
          ).length,
          monthlyAdmissions: patients.filter((p) => {
            const signedDate = new Date(p.time_signed);
            const now = new Date();
            return (
              signedDate.getMonth() === now.getMonth() &&
              signedDate.getFullYear() === now.getFullYear()
            );
          }).length,
        });

        const recentPatientsSorted = [...patients]
          .sort((a, b) => new Date(b.time_signed) - new Date(a.time_signed))
          .slice(0, 5)
          .map((p) => ({
            id: p.patient_id,
            name: `${p.name} ${p.surname}`,
            age: p.age,
            gender: p.gender,
            phone: p.phone,
            address: `${p.address1} ${p.address2 || ""}`,
            nextAppointment: "-",
          }));

        recentPatientsSorted.forEach((rp) => {
          const upcomingForPatient = sortedAppointments.find(
            (app) => app.patient_id === rp.id
          );
          if (upcomingForPatient) {
            rp.nextAppointment = new Date(
              upcomingForPatient.date
            ).toLocaleDateString();
          }
        });

        setRecentPatients(recentPatientsSorted);

        const upcomingAppointmentsMapped = sortedAppointments
          .slice(0, 5)
          .map((app) => ({
            id: app.appointment_id,
            patient: patientMap[app.patient_id] || "Unknown",
            date: new Date(app.date).toLocaleString(),
            type: app.description,
            fullData: app,
          }));

        setUpcomingAppointments(upcomingAppointmentsMapped);

        const pendingMapped = appointments
          .filter((app) => app.status === "Pending" && app.staff_id === null)
          .map((app) => ({
            id: app.appointment_id,
            patient: patientMap[app.patient_id] || "Unknown",
            date: new Date(app.date).toLocaleString(),
            type: app.description,
            fullData: app,
          }));

        setPendingAppointments(pendingMapped);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAcceptAppointment = (appointmentId) => {
    console.log("Accept appointment:", appointmentId);
    // Add API call to accept the appointment here
  };

  const handleEditAppointment = (appointmentId) => {
    console.log("Edit appointment:", appointmentId);
    // Add logic to open edit modal or navigate to edit page
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900">
          Maternity Dashboard
        </h1>
        <div className="flex space-x-4">
          <Link
            to="/signup_two"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            + New Patient
          </Link>
          <Link
            to="/prescriptions/new"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            + Prescribe Medicine
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon="👩⚕"
          color="bg-blue-100"
        />
        <StatCard
          title="Upcoming Appointments"
          value={stats.upcomingAppointments}
          icon="🗕"
          color="bg-green-100"
        />
        {/* <StatCard
          title="Recent Payments"
          value={stats.recentPayments}
          icon="💵"
          color="bg-purple-100"
        /> */}
        <StatCard
          title="Monthly Admissions"
          value={stats.monthlyAdmissions}
          icon="📈"
          color="bg-orange-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Recent Patients
          </h2>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {recentPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded cursor-pointer">
                <div>
                  <h3 className="font-medium">{patient.name}</h3>
                  <p className="text-sm text-gray-500">
                    Age: {patient.age}, Gender: {patient.gender}
                  </p>
                </div>
                <span className="text-sm text-blue-600">
                  Next: {patient.nextAppointment}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Upcoming Appointments
          </h2>
          <div className="max-h-64 overflow-y-auto">
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
                  <tr
                    key={appointment.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      setSelectedAppointment(appointment.fullData)
                    }>
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
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Pending Requests
        </h2>
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Patient</th>
                <th className="pb-2">Date & Time</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingAppointments.map((appointment) => (
                <tr key={appointment.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{appointment.patient}</td>
                  <td className="py-3">{appointment.date}</td>
                  <td className="py-3">
                    <span className="bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded">
                      {appointment.type}
                    </span>
                  </td>
                  <td className="py-3 space-x-2">
                    <button
                      onClick={() => handleAcceptAppointment(appointment.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                      Accept
                    </button>
                    <button
                      onClick={() => handleEditAppointment(appointment.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickAction
          title="Schedule Appointment"
          icon="➕"
          link="/appointments/new"
        />
        <QuickAction title="View Reports" icon="📊" link="/reports_doctor" />
        <QuickAction
          title="Payment Records"
          icon="💳"
          link="/payment_records_dash"
        />
        <QuickAction
          title="Search Patient"
          icon="🔍"
          link="/search_patient_doc"
        />
      </div>

      {selectedPatient && (
        <Modal onClose={() => setSelectedPatient(null)}>
          <h2 className="text-xl font-semibold mb-4">Patient Details</h2>
          <p>Name: {selectedPatient.name}</p>
          <p>Age: {selectedPatient.age}</p>
          <p>Gender: {selectedPatient.gender}</p>
          <p>Phone: {selectedPatient.phone}</p>
          <p>Address: {selectedPatient.address}</p>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
            Update
          </button>
        </Modal>
      )}

      {selectedAppointment && (
        <Modal onClose={() => setSelectedAppointment(null)}>
          <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
          <p>ID: {selectedAppointment.appointment_id}</p>
          <p>Description: {selectedAppointment.description}</p>
          <p>Date: {new Date(selectedAppointment.date).toLocaleString()}</p>
          <p>Payment Status: {selectedAppointment.payment_status}</p>
          <p>Status: {selectedAppointment.status}</p>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
            Update
          </button>
        </Modal>
      )}
    </div>
  );
};

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

const QuickAction = ({ title, icon, link }) => (
  <Link
    to={link}
    className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="text-center">
      <span className="text-3xl block mb-2">{icon}</span>
      <p className="text-sm font-medium text-gray-700">{title}</p>
    </div>
  </Link>
);

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-600">
        &times;
      </button>
      {children}
    </div>
  </div>
);

export default DoctorDash;
