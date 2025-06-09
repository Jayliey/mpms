import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  UserCircle,
  Calendar,
  CreditCard,
  ReceiptText,
  Pill,
  DollarSign
} from "lucide-react";

const PaymentHistoryNurse = () => {
  const [payments, setPayments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [ecoCashNumber, setEcoCashNumber] = useState("");

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

  const getPatientInfo = (id) => patients.find((pt) => pt.patient_id === id) || null;
  const getAppointmentInfo = (id) => appointments.find((app) => app.appointmentid === id) || null;
  const formatAmount = (amount) => `$${parseFloat(amount).toFixed(2)}`;

  const paymentBadgeStyle = (type) => {
    switch (type?.toLowerCase()) {
      case "card": return "bg-blue-100 text-blue-800";
      case "ecocash": return "bg-green-100 text-green-800";
      case "cash": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const Update = async (data) => {
    const appointment_id = data.appointment_id;
    try {
      const response = await fetch(`http://localhost:3001/appointment/patchy--update/${appointment_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_status: "Paid" })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to update payment status.");
      Swal.fire("Success", result.message, "success");
      handleModalClose();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const confirmPayment = async () => {
    setLoading(true);
    if (paymentMethod === "card") {
      Swal.fire("Info", "Card payments coming soon.", "info");
      setLoading(false);
      return;
    }
    if (paymentMethod === "ecocash" && !ecoCashNumber) {
      Swal.fire("Error", "Please enter your EcoCash number.", "error");
      setLoading(false);
      return;
    }
    try {
      const Number = ecoCashNumber;
      const Amount = selectedPayment.amount;
      const response = await fetch(`http://localhost:3001/payment/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Amount, Number })
      });
      const result = await response.json();
      await delay(5000);
      await verifyPayment(result.pollUrl);
    } catch (err) {
      Swal.fire("Error", "Payment initiation failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (pollUrl) => {
    setLoading(true);
    const startTime = Date.now();
    const interval = 15000;
    const maxTime = 120000;
    const endTime = startTime + maxTime;

    const poll = async () => {
      try {
        const response = await fetch(`http://localhost:3001/payment/check-payment-status?pollUrl=${pollUrl}`);
        if (!response.ok) throw new Error(await response.text());
        const result = await response.json();
        if (result.status === 200) {
          await Update(selectedPayment);
        } else if (result.status === 400) {
          Swal.fire("Error", result.message || "Payment failed.", "error");
        } else if (Date.now() < endTime) {
          setTimeout(poll, interval);
        } else {
          Swal.fire("Error", "Payment verification timed out.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Verification failed.", "error");
      } finally {
        setLoading(false);
      }
    };

    poll();
  };

  const handlePayClick = (payment) => {
    setSelectedPayment(payment);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setPaymentMethod("cash");
    setEcoCashNumber("");
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
      <h2 className="text-4xl font-extrabold mb-6 text-gray-800 flex items-center gap-2">💳 Payment History</h2>

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
              <div key={payment.payment_id} className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 space-y-5 hover:shadow-xl transition duration-300 ease-in-out">
                <div className="flex items-center gap-4">
                  <UserCircle className="w-12 h-12 text-blue-500" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{patient ? `${patient.name} ${patient.surname}` : "Unknown Patient"}</h3>
                    <p className="text-gray-500 text-sm">{patient?.phone || "No phone"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span>{appointment ? `${appointment.reason} — ${new Date(appointment.date).toLocaleString()}` : "No appointment details"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Pill className="w-5 h-5 text-gray-500" />
                  <span>Medication ID: {payment.medicationid || "—"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentBadgeStyle(payment.paymenttype)}`}>{payment.paymenttype}</span>
                </div>
                <div className="text-right">
                  <span className="text-green-700 text-2xl font-bold">{formatAmount(payment.amount)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
                  <div className="flex items-center gap-2">
                    <ReceiptText className="w-4 h-4" />
                    <span className="font-mono">{payment.receiptnumber}</span>
                  </div>
                  <span>{new Date(payment.date_paid).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
                {payment.payment_status === "Pending" && (
                  <button onClick={() => handlePayClick(payment)} className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Pay</button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Complete Payment</h3>

            <label className="block mb-2 text-sm font-medium">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            >
              <option value="cash">Cash</option>
              <option value="ecocash">EcoCash</option>
            </select>

            {paymentMethod === "ecocash" && (
              <div>
                <label className="block mb-2 text-sm font-medium">EcoCash Number</label>
                <input
                  type="text"
                  value={ecoCashNumber}
                  onChange={(e) => setEcoCashNumber(e.target.value)}
                  className="w-full mb-4 p-2 border rounded"
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button onClick={handleModalClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
              <button
                onClick={async () => {
                  if (paymentMethod === "cash") {
                    await Update(selectedPayment);
                  } else {
                    await confirmPayment();
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryNurse;
