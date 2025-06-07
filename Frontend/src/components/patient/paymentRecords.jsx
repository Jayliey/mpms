import React, { useEffect, useState } from "react";
import {
  UserCircle,
  Calendar,
  CreditCard,
  ReceiptText,
  Pill,
} from "lucide-react";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current patient from local storage
  const storedData = JSON.parse(localStorage.getItem("patient"));
  const patient = Array.isArray(storedData) ? storedData[0] : storedData;

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [paymentRes, appointmentRes] = await Promise.all([
          fetch("http://localhost:3001/payments/"),
          fetch("http://localhost:3001/appointment/"),
        ]);

        if (!paymentRes.ok || !appointmentRes.ok) {
          throw new Error("Failed to fetch payment or appointment data");
        }

        const [paymentData, appointmentData] = await Promise.all([
          paymentRes.json(),
          appointmentRes.json(),
        ]);

        // Filter for logged-in patient's payments
        const filteredPayments = paymentData.filter(
          (p) => p.patient_id === patient?.patient_id
        );

        console.log(appointmentData);
        setPayments(filteredPayments);
        setAppointments(appointmentData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [patient?.patient_id]);

  // FIXED KEY: appointment_id
  const getAppointmentInfo = (id) => {
    return appointments.find((a) => a.appointment_id === id) || null;
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
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <CreditCard className="w-7 h-7 text-blue-500" />
        Payment History
      </h2>

      {payments.length === 0 ? (
        <p className="text-gray-600">No payment records found for your account.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {payments.map((payment) => {
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
                      {`${patient?.name} ${patient?.surname}`}
                    </h3>
                    <p className="text-gray-500 text-sm">{patient?.phone}</p>
                  </div>
                </div>

                {/* Appointment Info */}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>
                    {appointment
                      ? appointment.description
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
