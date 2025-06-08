import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3001/patient/";
const MEDICATION_API = "http://localhost:3001/medication/patient/";

export default function SearchPatientsPage() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editPatient, setEditPatient] = useState(null);
  const [medications, setMedications] = useState([]);
  const [showMedicationsModal, setShowMedicationsModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(API_URL);
      setPatients(response.data);
      setFilteredPatients(response.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch patients", "error");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(value) ||
        patient.surname.toLowerCase().includes(value)
    );
    setFilteredPatients(filtered);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const updatedData = { ...editPatient };
      delete updatedData.patient_id;
      delete updatedData.status;
      delete updatedData.time_signed;

      const res = await axios.put(
        `${API_URL}${editPatient.patient_id}`,
        updatedData
      );
      Swal.fire(
        "Updated",
        "Patient information updated successfully",
        "success"
      );
      fetchPatients();
      setEditPatient(null);
      setSelectedPatient(null);
    } catch (error) {
      Swal.fire("Error", "Failed to update patient info", "error");
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This patient record will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}${selectedPatient.patient_id}`);
        Swal.fire("Deleted!", "Patient record has been deleted.", "success");
        fetchPatients();
        setSelectedPatient(null);
      } catch (error) {
        Swal.fire("Error", "Failed to delete patient", "error");
      }
    }
  };

  const fetchMedications = async (patientId) => {
    try {
      const response = await axios.get(`${MEDICATION_API}${patientId}`);
      setMedications(response.data);
      setShowMedicationsModal(true);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch medication history", "error");
    }
  };

  const handleSellClick = (medication) => {
    Swal.fire("Action", "Selling this Medication!", "info");
    navigate("/sell", { state: { prescription: medication } });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Patients (Maternity)</h1>
      <input
        type="text"
        placeholder="Search by name or surname"
        value={searchTerm}
        onChange={handleSearch}
        className="border p-2 rounded w-full mb-6"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => (
          <div
            key={patient.patient_id}
            className="border rounded p-4 hover:shadow-lg relative">
            <h2 className="text-lg font-semibold">
              {patient.name} {patient.surname}
            </h2>
            <p>Age: {patient.age}</p>
            <p>Status: {patient.status}</p>
            <p>Gender: {patient.gender || "-"}</p>
            <div className="mt-2 flex gap-2">
              <button
                className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
                onClick={() => setSelectedPatient(patient)}>
                View Details
              </button>
              <button
                className="bg-purple-600 text-white px-2 py-1 rounded text-sm"
                onClick={() => fetchMedications(patient.patient_id)}>
                Show Medication History
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Medication Modal */}
      {showMedicationsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">Medication History</h2>
            {medications.length === 0 ? (
              <p>No medical records found for this patient.</p>
            ) : (
              <div className="space-y-4">
                {medications.map((med, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded-lg shadow-sm bg-gray-50">
                    <div className="mb-2">
                      <p className="font-bold text-lg text-blue-700">
                        {med.description}
                      </p>
                      <p className="text-sm text-gray-700 italic">
                        Prescribed by: {med.assigned_by}
                      </p>
                    </div>
                    <p className="text-sm">
                      Instructions: {med.consumption_description}
                    </p>
                    <p className="text-sm">
                      Start Date: {new Date(med.start_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      End Date: {new Date(med.end_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      Status: <span
                        className={`font-semibold ${
                          med.consumption_status === "completed"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}>
                        {med.consumption_status}
                      </span>
                    </p>
                    {med.consumption_status.toLowerCase() === "pending" && (
                      <div className="mt-3">
                        <button
                          className="bg-green-600 text-white px-3 py-1 rounded"
                          onClick={() => handleSellClick(med)}>
                          Sell
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 text-right">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowMedicationsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">
              Patient Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(selectedPatient)
                .filter(
                  ([key, value]) =>
                    value !== null &&
                    value !== "" &&
                    key !== "patient_id" &&
                    key !== "time_signed"
                )
                .map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold capitalize">
                        {key.replace(/_/g, " ")}:
                      </span>{" "}
                      {value}
                    </p>
                  </div>
                ))}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => setEditPatient(selectedPatient)}>
                Update Details
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleDelete}>
                Delete Patient
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setSelectedPatient(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {editPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">Edit Patient Info</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(editPatient)
                .filter(
                  ([key]) =>
                    key !== "patient_id" &&
                    key !== "time_signed" &&
                    key !== "status" &&
                    key !== "gender"
                )
                .map(([key, value]) => (
                  <div key={key}>
                    {key === "marital_status" ? (
                      <>
                        <label className="block text-sm font-medium">
                          Marital Status
                        </label>
                        <select
                          name="marital_status"
                          value={editPatient.marital_status || ""}
                          onChange={handleEditChange}
                          className="border p-2 rounded w-full">
                          <option value="">Select</option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                        </select>
                      </>
                    ) : key.includes("spouse") &&
                      editPatient.marital_status !== "Married" ? null : (
                      <>
                        <label className="block text-sm font-medium">
                          {key.replace(/_/g, " ")}
                        </label>
                        <input
                          name={key}
                          value={value || ""}
                          onChange={handleEditChange}
                          className="border p-2 rounded w-full"
                        />
                      </>
                    )}
                  </div>
                ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleUpdate}>
                Save Changes
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => setEditPatient(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
