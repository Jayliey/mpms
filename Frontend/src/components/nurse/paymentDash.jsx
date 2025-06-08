import React, { useEffect, useState } from "react";
import { UserCircle, Calendar, CreditCard, ReceiptText, Pill } from "lucide-react";

const PaymentHistoryNurse = () => {
  const [payments, setPayments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
      case "cash":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const patient = getPatientInfo(payment.patient_id);
    const patientName = patient ? `${patient.name} ${patient.surname}` : "Unknown Patient";
    return (
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.paymenttype?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.receiptnumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) return <p className="text-center py-4 text-lg animate-pulse">Loading payment history...</p>;
  if (error) return <p className="text-red-500 text-center py-4 text-lg">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-4xl font-extrabold mb-6 text-gray-800 flex items-center gap-2">
        💳 Payment History
      </h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by patient name, payment type, or receipt number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full shadow-sm focus:ring focus:ring-blue-200"
        />
      </div>

      {filteredPayments.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No matching payment records found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPayments.map((payment) => {
            const patient = getPatientInfo(payment.patient_id);
            const appointment = getAppointmentInfo(payment.appointmentid);
            return (
              <div
                key={payment.payment_id}
                className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 space-y-5 hover:shadow-xl transition duration-300 ease-in-out"
              >
                {/* Patient Info */}
                <div className="flex items-center gap-4">
                  <UserCircle className="w-12 h-12 text-blue-500" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {patient ? `${patient.name} ${patient.surname}` : "Unknown Patient"}
                    </h3>
                    <p className="text-gray-500 text-sm">{patient?.phone || "No phone"}</p>
                  </div>
                </div>

                {/* Appointment Info */}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span>
                    {appointment
                      ? `${appointment.reason} — ${new Date(appointment.date).toLocaleString()}`
                      : "No appointment details"}
                  </span>
                </div>

                {/* Medication Info */}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Pill className="w-5 h-5 text-gray-500" />
                  <span>Medication ID: {payment.medicationid || "—"}</span>
                </div>

                {/* Payment Type */}
                <div className="flex items-center gap-3 text-sm">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentBadgeStyle(
                      payment.paymenttype
                    )}`}
                  >
                    {payment.paymenttype}
                  </span>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <span className="text-green-700 text-2xl font-bold">
                    {formatAmount(payment.amount)}
                  </span>
                </div>

                {/* Receipt and Date */}
                <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
                  <div className="flex items-center gap-2">
                    <ReceiptText className="w-4 h-4" />
                    <span className="font-mono">{payment.receiptnumber}</span>
                  </div>
                  <span>
                    {new Date(payment.date_paid).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryNurse;
