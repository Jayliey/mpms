import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const PATIENT_API = "http://localhost:3001/patient/";
const STAFF_API = "http://localhost:3001/staff/";
const MEDICATION_API = "http://localhost:3001/medication/";
const APPOINTMENT_API = "http://localhost:3001/appointment/";

export default function PrescriptionPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [staffName, setStaffName] = useState("");
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState();

  // Form state
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [instructions, setInstructions] = useState("");
  const [cost, setCost] = useState("");

  useEffect(() => {
    fetchPatients();
    fetchStaffName();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get(PATIENT_API);
      setPatients(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to load patients", "error");
    }
  };

  const fetchStaffName = async () => {
    try {
      const staffData = localStorage.getItem("doctor");
      if (!staffData) throw new Error("No staff ID found in localStorage");
    const staffAll = JSON.parse(staffData);

    // Extract the staff_id
    const staffId = staffAll.staff_id;
    setId(staffId);
      const res = await axios.get(`${STAFF_API}${staffId}`);
      console.log("res", res.data[0]);
      setStaffName(res.data[0].name || `${res.data[0].name || ""} ${res.data[0].surname || ""}`.trim());
    } catch (error) {
      Swal.fire("Error", "Failed to load staff user info", "error");
    }
  };

  const validateForm = () => {
    if (!selectedPatientId) {
      Swal.fire("Validation", "Please select a patient", "warning");
      return false;
    }
    if (!description.trim()) {
      Swal.fire("Validation", "Please enter medicine description", "warning");
      return false;
    }
    if (!startDate) {
      Swal.fire("Validation", "Please select a start date", "warning");
      return false;
    }
    if (!endDate) {
      Swal.fire("Validation", "Please select an end date", "warning");
      return false;
    }
    if (new Date(endDate) < new Date(startDate)) {
      Swal.fire("Validation", "End date cannot be before start date", "warning");
      return false;
    }
    if (!instructions.trim()) {
      Swal.fire("Validation", "Please enter consumption instructions", "warning");
      return false;
    }
    if (!cost.trim() || isNaN(cost) || Number(cost) < 0) {
      Swal.fire("Validation", "Please enter a valid cost", "warning");
      return false;
    }
  
    
    if (!staffName) {
          console.log(staffName);
      Swal.fire("Validation", "Staff information not loaded yet", "warning");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
  

    try {
        console.log("honai",id)
      // Post to medication API
      await axios.post(MEDICATION_API, {
        patient_id: parseInt(selectedPatientId, 10),
        staff_id: parseInt(id, 10),
        assigned_by: staffName,
        description: description.trim(),
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
        consumption_description: instructions.trim(),
        consumption_status: "pending",
      });

      // Post to appointment API
      await axios.post(APPOINTMENT_API, {
        patient_id: parseInt(selectedPatientId, 10),
        staff_id: parseInt(id, 10),
        description: "medication",
        appointment_category: "medical",
        appointment_state: "normal",
        cost: Number(cost),
        payment_status: "Pending",
        status: "Pending",
        date: new Date(startDate).toISOString(),
      });

      Swal.fire("Success", "Prescription and appointment created successfully!", "success");

      // Reset form
      setSelectedPatientId("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setInstructions("");
      setCost("");
    } catch (error) {
      Swal.fire("Error", "Failed to create prescription or appointment", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Prescribe Medicine</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient selector */}
        <div>
          <label htmlFor="patient" className="block mb-1 font-semibold">
            Select Patient
          </label>
          <select
            id="patient"
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="w-full border rounded p-2"
            required
          >
            <option value="">-- Select Patient --</option>
            {patients.map((p) => (
              <option key={p.patient_id} value={p.patient_id}>
                {p.name} {p.surname} (ID: {p.patient_id})
              </option>
            ))}
          </select>
        </div>

        {/* Medicine description */}
        <div>
          <label htmlFor="description" className="block mb-1 font-semibold">
            Medicine Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="E.g. Amoxicillin, Paracetamol"
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* Start and End Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block mb-1 font-semibold">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block mb-1 font-semibold">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
        </div>

        {/* Consumption instructions */}
        <div>
          <label htmlFor="instructions" className="block mb-1 font-semibold">
            Consumption Instructions
          </label>
          <textarea
            id="instructions"
            rows={3}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="E.g. Take 1 tablet per day after meals"
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* Cost */}
        <div>
          <label htmlFor="cost" className="block mb-1 font-semibold">
            Cost (in your currency)
          </label>
          <input
            id="cost"
            type="number"
            min="0"
            step="0.01"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="E.g. 50.00"
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* Submit button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : "Prescribe Medicine"}
          </button>
        </div>
      </form>
    </div>
  );
}
