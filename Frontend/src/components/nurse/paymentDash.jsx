import React, { useEffect, useState } from "react";
import { UserCircle, Calendar, CreditCard, ReceiptText, Pill } from "lucide-react";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all required data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [paymentRes, patientRes, appointmentRes] = await Promise.all([
          fetch("http://localhost:3001/payments/"),
          fetch("http://localhost:3001/patient/"),
          fetch("http://localhost:3001/appointment/")
        ]);

        if (!paymentRes.ok || !patientRes.ok || !appointmentRes.ok) {
          throw new Error("Failed to fetch one or more resources");
        }

        const [paymentData, patientData, appointmentData] = await Promise.all([
          paymentRes.json(),
          patientRes.json(),
          appointmentRes.json()
        ]);

        setPayments(paymentData);
        setPatients(patientData);
        setAppointments(appointmentData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const getPatientInfo = (id) => {
    const p = patients.find((pt) => pt.patient_id === id);
    return p || null;
  };

  const getAppointmentInfo = (id) => {
    const a = appointments.find((app) => app.appointmentid === id);
    return a || null;
  };

  const formatAmount = (amount) => `$${parseFloat(amount).toFixed(2)}`;

  const paymentBadgeStyle = (type) => {
    switch (type?.toLowerCase()) {
      case "card":
        return "bg-blue-100 text-blue-800";
      case "ecocash":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <p className="text-center py-4">Loading payment history...</p>;
  if (error) return <p className="text-red-500 text-center py-4">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">💳 Payment History</h2>

      {payments.length === 0 ? (
        <p className="text-gray-600">No payment records found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {payments.map((payment) => {
            const patient = getPatientInfo(payment.patient_id);
            const appointment = getAppointmentInfo(payment.appointmentid);
            return (
              <div
                key={payment.payment_id}
                className="bg-white shadow-md rounded-xl p-5 border border-gray-100 space-y-4"
              >
                {/* Patient Info */}
                <div className="flex items-center gap-4">
                  <UserCircle className="w-10 h-10 text-blue-500" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {patient ? `${patient.name} ${patient.surname}` : "Unknown Patient"}
                    </h3>
                    <p className="text-gray-500 text-sm">{patient?.phone || "No phone"}</p>
                  </div>
                </div>

                {/* Appointment Info */}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>
                    {appointment
                      ? `${appointment.reason} — ${new Date(appointment.date).toLocaleString()}`
                      : "No appointment details"}
                  </span>
                </div>

                {/* Medication Info */}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Pill className="w-4 h-4 text-gray-500" />
                  <span>Medication ID: {payment.medicationid || "—"}</span>
                </div>

                {/* Payment Type */}
                <div className="flex items-center gap-3 text-sm">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${paymentBadgeStyle(
                      payment.paymenttype
                    )}`}
                  >
                    {payment.paymenttype}
                  </span>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <span className="text-green-700 text-lg font-bold">
                    {formatAmount(payment.amount)}
                  </span>
                </div>

                {/* Receipt and Date */}
                <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
                  <div className="flex items-center gap-2">
                    <ReceiptText className="w-4 h-4" />
                    <span>{payment.receiptnumber}</span>
                  </div>
                  <span>{new Date(payment.payment_date).toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
