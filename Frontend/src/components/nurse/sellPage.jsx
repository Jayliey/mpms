import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function SellMedicationPage() {
  const [medications, setMedications] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [ecoCashNumber, setEcoCashNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const res = await axios.get("http://localhost:3001/medication/");
      setMedications(res.data.filter((med) => med.consumption_status === "pending"));
    } catch (err) {
      Swal.fire("Error", "Failed to fetch medications", "error");
    }
  };

  const handleSell = async (med) => {
    try {
      const res = await axios.get(`http://localhost:3001/patient/${med.patient_id}`);
      setPatientDetails(res.data);
      setSelectedMedication(med);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch patient details", "error");
    }
  };

  const generateReceiptNumber = () => {
    return "REC" + Math.floor(100000 + Math.random() * 900000);
  };

  const updateMedicationStatus = async (medicationId) => {
    try {
      await axios.patch(`http://localhost:3001/medication/medupdate/${medicationId}`, {
        column: "consumption_status",
        value: "inprogress",
      });
    } catch (err) {
      console.error("Failed to update medication status", err);
    }
  };

  const Update = async (payment) => {
    try {
      const payload = {
        patient_id: payment.patient_id,
        appointmentid: null,
        medicationid: payment.medication_id,
        paymenttype: payment.paymenttype,
        description: payment.description,
        receiptnumber: generateReceiptNumber(),
        amount: payment.amount,
      };
      await axios.post("http://localhost:3001/payments/", payload);
      await updateMedicationStatus(payment.medication_id);
      setReceipt(payload);
      Swal.fire("Success", "Payment successful and recorded.", "success");
      fetchMedications();
      resetForm();
    } catch (err) {
      Swal.fire("Error", "Failed to post payment.", "error");
    }
  };

  const resetForm = () => {
    setSelectedMedication(null);
    setPatientDetails(null);
    setPaymentMethod("");
    setEcoCashNumber("");
    setReceipt(null);
    setLoading(false);
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const confirmPayment = async () => {
    setLoading(true);
    if (paymentMethod === "cash") {
      await Update({
        ...selectedMedication,
        paymenttype: "cash",
        description: selectedMedication.description,
        amount: selectedMedication.amount || 10,
      });
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
      const Amount = selectedMedication.amount || 10;
      const response = await fetch(`http://localhost:3001/payment/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Amount, Number }),
      });

      const result = await response.json();
      await delay(5000);
      verifyPayment(result.pollUrl);
    } catch (err) {
      Swal.fire("Error", "Payment initiation failed.", "error");
      setLoading(false);
    }
  };

  const verifyPayment = async (pollUrl) => {
    const startTime = Date.now();
    const interval = 15000;

    const pollPaymentStatus = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/payment/check-payment-status?pollUrl=${pollUrl}`
        );
        const result = await response.json();

        if (result.status === 200) {
          await Update({
            ...selectedMedication,
            paymenttype: paymentMethod,
            description: selectedMedication.description,
            amount: selectedMedication.amount || 10,
          });
          clearInterval(polling);
          setLoading(false);
        } else if (result.status === 400) {
          clearInterval(polling);
          Swal.fire("Error", result.message || "Payment failed.", "error");
          setLoading(false);
        }
      } catch (error) {
        clearInterval(polling);
        Swal.fire("Error", "Verification failed.", "error");
        setLoading(false);
      }
    };

    const polling = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime >= 120000) return;
      pollPaymentStatus();
    }, interval);

    pollPaymentStatus();
  };

  const filteredMedications = medications.filter((med) =>
    med.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Sell Medication</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search medications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMedications.map((med) => (
          <div
            key={med.medication_id}
            className="border p-4 rounded shadow hover:shadow-lg transition"
          >
            <p className="font-semibold text-lg">{med.description}</p>
            <p className="text-sm text-gray-500">Prescribed by: {med.assigned_by}</p>
            <p className="text-sm">Consumption: {med.consumption_description}</p>
            <p className="text-sm text-gray-600">Start: {formatDate(med.start_date)}</p>
            <p className="text-sm text-gray-600">End: {formatDate(med.end_date)}</p>
            <p className="text-sm text-gray-700 font-semibold mt-1">Amount: ${med.amount || 10}</p>

            <button
              className="bg-green-600 text-white px-3 py-1 mt-2 rounded w-full"
              onClick={() => handleSell(med)}
            >
              Sell
            </button>
          </div>
        ))}
      </div>

      {selectedMedication && patientDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-6 relative">
            <h2 className="text-2xl font-bold mb-4">Confirm Sale</h2>
            <p className="mb-2 font-semibold text-lg">
              Patient: {patientDetails.name} {patientDetails.surname}
            </p>
            <p className="mb-1 text-sm text-gray-700">Phone: {patientDetails.phone}</p>
            <p className="mb-1 text-sm text-gray-700">Gender: {patientDetails.gender}</p>

            <p className="mb-2">Description: {selectedMedication.description}</p>
            <p className="mb-2">Prescribed by: {selectedMedication.assigned_by}</p>
            <p className="mb-2">Consumption: {selectedMedication.consumption_description}</p>
            <p className="mb-2">Amount: ${selectedMedication.amount || 10}</p>

            <label className="block mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            >
              <option value="">Select</option>
              <option value="cash">Cash</option>
              <option value="ecocash">EcoCash</option>
            </select>

            {paymentMethod === "ecocash" && (
              <input
                type="text"
                placeholder="EcoCash Number"
                value={ecoCashNumber}
                onChange={(e) => setEcoCashNumber(e.target.value)}
                className="border p-2 rounded w-full mb-2"
              />
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                onClick={confirmPayment}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm Payment"}
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {receipt && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 border w-80 animate-fade-in">
          <h3 className="text-lg font-bold mb-2">Receipt</h3>
          <p>Receipt #: {receipt.receiptnumber}</p>
          <p>Patient ID: {receipt.patient_id}</p>
          <p>Description: {receipt.description}</p>
          <p>Payment Type: {receipt.paymenttype}</p>
          <p>Amount: ${receipt.amount}</p>
          <button
            className="mt-2 bg-blue-600 text-white px-4 py-1 rounded w-full"
            onClick={() => setReceipt(null)}
          >
            Close Receipt
          </button>
        </div>
      )}
    </div>
  );
}
