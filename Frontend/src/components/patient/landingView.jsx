import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const PatientHome = () => {
  const [stats, setStats] = useState({
    totalVisits: 0,
    upcomingAppointments: 0,
    recentPayments: 0,
  });

  const [pendingPayments, setPendingPayments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [ecoCashNumber, setEcoCashNumber] = useState("");

  const storedData = JSON.parse(localStorage.getItem("patient"));
  const patient = Array.isArray(storedData) ? storedData[0] : storedData;

  const [formData, setFormData] = useState({
    patient_id: "",
    staff_id: "",
    description: "",
    appointment_category: "",
    appointment_state: "",
    cost: "",
    payment_status: "",
    status: "Pending",
    date: "",
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/appointment/patient/${patient.patient_id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const result = await response.json();
        const now = new Date();

        const totalVisits = result.length;

        const upcoming = result.filter(
          (a) => new Date(a.date) > now && a.status === "Scheduled"
        );
        const paid = result.filter((a) => a.payment_status === "Paid");
        const pending = result.filter((a) => a.payment_status === "Pending");

        setStats({
          totalVisits: totalVisits,
          upcomingAppointments: upcoming.length,
          recentPayments: paid.length,
        });

        setUpcomingAppointments(
          upcoming.map((appt) => ({
            id: appt.appointment_id,
            staff: `Staff ${appt.staff_id}`,
            date: new Date(appt.date).toLocaleString(),
            description: appt.description,
            type: appt.appointment_category,
            raw: appt,
          }))
        );

        setPendingPayments(
          pending.map((appt) => ({
            id: appt.appointment_id,
            name: appt.description || "No description",
            amount: appt.cost,
            dueDate: new Date(appt.date).toISOString().split("T")[0],
          }))
        );
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Something went wrong.", "error");
      }
    };

    fetchAppointments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Pay now or later?",
      showDenyButton: true,
      confirmButtonText: "Pay Now",
      denyButtonText: "Later",
    });

    const paymentStatus = result.isConfirmed ? "Paid" : "Pending";

    const payload = { ...formData, payment_status: paymentStatus };

    try {
      const response = await fetch("http://localhost:3001/appointment/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Swal.fire("Success", "Appointment scheduled successfully.", "success");
        setShowModal(false);
        setFormData({
          patient_id: "",
          staff_id: "",
          description: "",
          appointment_category: "",
          appointment_state: "",
          payment_status: "",
          status: "Scheduled",
          date: "",
        });
      } else {
        Swal.fire("Error", "Failed to schedule appointment.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  const handlePayClick = (payment) => {
    setSelectedPayment(payment);
    setPaymentMethod("");
    setEcoCashNumber("");
  };

  const confirmPayment = () => {
    if (paymentMethod === "ecocash" && !ecoCashNumber) {
      return Swal.fire("Error", "Please enter your EcoCash number.", "error");
    }

    Swal.fire("Success", "Payment successful.", "success").then(() => {
      setSelectedPayment(null);
    });
  };

  const handleAppointmentClick = (appt) => {
    setSelectedAppointment(appt);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900">
          Hello {patient.name}
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Schedule Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Visits"
          value={stats.totalVisits}
          icon="🩺"
          color="bg-blue-100"
        />
        <StatCard
          title="Upcoming Appointments"
          value={stats.upcomingAppointments}
          icon="📅"
          color="bg-green-100"
        />
        <StatCard
          title="Total Payments"
          value={stats.recentPayments}
          icon="💵"
          color="bg-purple-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Pending Payments
          </h2>
          {pendingPayments.length === 0 ? (
            <p className="text-gray-500 text-sm">No payments pending.</p>
          ) : (
            pendingPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex justify-between p-3 hover:bg-gray-50 rounded cursor-pointer"
                onClick={() => handlePayClick(payment)}>
                <div>
                  <h3 className="font-medium">{payment.name}</h3>
                  <p className="text-sm text-gray-500">
                    Due: {payment.dueDate}
                  </p>
                </div>
                <span className="text-sm text-red-600 font-semibold">
                  ${payment.amount}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Upcoming Appointments
          </h2>
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Staff</th>
                <th className="pb-2">Date & Time</th>
                <th className="pb-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {upcomingAppointments.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="py-4 text-center text-sm text-gray-500">
                    No upcoming appointments.
                  </td>
                </tr>
              ) : (
                upcomingAppointments.map((appt) => (
                  <tr
                    key={appt.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleAppointmentClick(appt)}>
                    <td className="py-3">{appt.staff}</td>
                    <td className="py-3">{appt.date}</td>
                    <td className="py-3">
                      <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                        {appt.type}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
        <QuickAction title="Profile" icon="👤" link="/patient_profile" />
        <QuickAction title="View Reports" icon="📊" link="/reports" />
        <QuickAction title="Payment Records" icon="💳" link="/payment_records" />
      </div>

      {/* Appointment Scheduling Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Schedule Appointment</h2>
       <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Patient ID"
                className="w-full p-2 border rounded"
                value={formData.patient_id}
                onChange={(e) =>
                  setFormData({ ...formData, patient_id: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Staff ID"
                className="w-full p-2 border rounded"
                value={formData.staff_id}
                onChange={(e) =>
                  setFormData({ ...formData, staff_id: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Description"
                className="w-full p-2 border rounded"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <select
                className="w-full p-2 border rounded"
                value={formData.appointment_category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    appointment_category: e.target.value,
                  })
                }>
                <option value="">Select Category</option>
                <option value="lab">Lab</option>
                <option value="maternity">Maternity</option>
                <option value="ultrasound">Ultrasound</option>
              </select>
              <select
                className="w-full p-2 border rounded"
                value={formData.appointment_state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    appointment_state: e.target.value,
                  })
                }>
                <option value="">Select State</option>
                <option value="normal">Normal</option>
                <option value="emergency">Emergency</option>
              </select>
              <input
                type="datetime-local"
                className="w-full p-2 border rounded"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm space-y-4">
            <h2 className="text-lg font-semibold">Complete Payment</h2>
            <p className="text-gray-600">{selectedPayment.name}</p>
            <p className="text-gray-600">Amount: ${selectedPayment.amount}</p>
            <div>
              <label className="block text-sm mb-1">Payment Method:</label>
              <select
                className="w-full p-2 border rounded"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="">Select Method</option>
                <option value="card">Card</option>
                <option value="ecocash">EcoCash</option>
              </select>
            </div>
            {paymentMethod === "ecocash" && (
              <input
                type="text"
                placeholder="Enter EcoCash number"
                value={ecoCashNumber}
                onChange={(e) => setEcoCashNumber(e.target.value)}
                className="w-full p-2 border rounded"
              />
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button
                onClick={confirmPayment}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm space-y-4">
            <h2 className="text-lg font-semibold">Appointment Details</h2>
            <p><strong>Staff:</strong> {selectedAppointment.staff}</p>
            <p><strong>Date:</strong> {selectedAppointment.date}</p>
            <p><strong>Type:</strong> {selectedAppointment.type}</p>
            <p><strong>Description:</strong> {selectedAppointment.description}</p>
            <button
              onClick={() => setSelectedAppointment(null)}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Close
            </button>
          </div>
        </div>
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

export default PatientHome;
