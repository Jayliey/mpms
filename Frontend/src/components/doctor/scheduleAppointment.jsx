import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function CreateAppointmentPage() {
  const doctorData = JSON.parse(localStorage.getItem("doctor"));
  const staffId = doctorData?.staff_id || 1;

  const [patients, setPatients] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    patient_id: "",
    staff_id: staffId,
    description: "",
    appointment_category: "",
    appointment_state: "normal",
    cost: "",
    payment_status: "Pending",
    status: "Scheduled",
    date: "",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await fetch("http://localhost:3001/patient/");
      const data = await res.json();
      setPatients(data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch patients", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patient_id || !formData.description || !formData.appointment_category || !formData.cost || !formData.date) {
      Swal.fire("Validation Error", "Please fill in all required fields.", "warning");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:3001/appointment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        Swal.fire("Success", "Appointment created successfully", "success");

        // Reset form
        setFormData({
          patient_id: "",
          staff_id: staffId,
          description: "",
          appointment_category: "",
          appointment_state: "normal",
          cost: "",
          payment_status: "Pending",
          status: "Scheduled",
          date: "",
        });
      } else {
        Swal.fire("Error", "Failed to create appointment", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to create appointment", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create Appointment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient Dropdown */}
        <div>
          <label className="block mb-1 font-medium">Select Patient</label>
          <select
            name="patient_id"
            value={formData.patient_id}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">-- Select Patient --</option>
            {patients.map((p) => (
              <option key={p.patient_id} value={p.patient_id}>
                {p.name} {p.surname}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block mb-1 font-medium">Appointment Category</label>
          <select
            name="appointment_category"
            value={formData.appointment_category}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">-- Select Category --</option>
            <option value="maternity">Maternity</option>
            <option value="scale">Scale</option>
            <option value="general checkup">General Checkup</option>
            <option value="consultation">Consultation</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* State */}
        <div>
          <label className="block mb-1 font-medium">Appointment State</label>
          <select
            name="appointment_state"
            value={formData.appointment_state}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="normal">Normal</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>

        {/* Cost */}
        <div>
          <label className="block mb-1 font-medium">Cost (USD)</label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1 font-medium">Appointment Date</label>
          <input
            type="date"
            name="date"
            value={formData.date.split("T")[0]}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                date: new Date(e.target.value).toISOString(),
              }))
            }
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} text-white px-4 py-2 rounded`}
          >
            {isSubmitting ? "Processing..." : "Create Appointment"}
          </button>
        </div>
      </form>
    </div>
  );
}
