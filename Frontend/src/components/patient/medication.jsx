import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const API = "http://localhost:3001/medication";

const PatientMedications = () => {
  const patient = JSON.parse(localStorage.getItem("patient"))?.[0];
  const [medications, setMedications] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await fetch(`${API}/patient/${patient.patient_id}`);
        const data = await response.json();
        console.log("honai", data);
        setMedications(data);
      } catch (error) {
        console.error("Failed to fetch medications", error);
        Swal.fire("Error", "Could not load medications", "error");
      }
    };

    if (patient?.patient_id) fetchMedications();
  }, [patient?.patient_id]);

const handleMarkCompleted = async (id) => {
    console.log("id yacho", id);
  const result = await Swal.fire({
    title: "Mark this medication as completed?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, mark completed",
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch(`${API}/medupdate/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          column: "consumption_status",
          value: "completed"
        }),
      });

      if (response.ok) {
        Swal.fire("Updated!", "Medication marked as completed.", "success");
        
        // Refresh list locally
        const updated = medications.map((med) =>
          med.medication_id === id
            ? { ...med, consumption_status: "completed" }
            : med
        );
        setMedications(updated);
      } else {
        Swal.fire("Error", "Failed to update medication.", "error");
      }
    } catch (error) {
      console.error("Update failed", error);
      Swal.fire("Error", "An unexpected error occurred.", "error");
    }
  }
};


  const filteredMedications = medications.filter((med) =>
    filter === "completed"
      ? med.consumption_status === "completed"
      : filter === "pending"
      ? med.consumption_status === "pending"
      : true
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">
        Your Medications
      </h1>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded ${
            filter === "pending"
              ? "bg-yellow-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded ${
            filter === "completed"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Completed
        </button>
      </div>

      {filteredMedications.length === 0 ? (
        <p className="text-gray-500">No medications to display.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMedications.map((med) => (
            <div
              key={med.medication_id}
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {med.description}
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Prescribed By:</strong> {med.assigned_by}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Dosage:</strong> {med.consumption_description}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>From:</strong>{" "}
                {new Date(med.start_date).toLocaleDateString()}{" "}
                <strong>to</strong>{" "}
                {new Date(med.end_date).toLocaleDateString()}
              </p>
              <p className="text-sm mb-2">
                <span
                  className={`inline-block px-2 py-1 text-xs rounded ${
                    med.consumption_status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {med.consumption_status.toUpperCase()}
                </span>
              </p>
              {med.consumption_status !== "completed" && (
                <button
                  onClick={() => handleMarkCompleted(med.medication_id)}
                  className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientMedications;
