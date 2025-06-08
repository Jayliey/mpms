import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const API = "http://localhost:3001/medication"; // Adjust if your base API is different

const PatientProfile = () => {
  const storedData = JSON.parse(localStorage.getItem("patient"));
  const patient = Array.isArray(storedData) ? storedData[0] : storedData;

  const [medications, setMedications] = useState([]);

  const fetchMedications = async () => {
    try {
      const response = await fetch(`${API}/patient/${patient.patient_id}`);
      const data = await response.json();
      setMedications(data);
    } catch (error) {
      console.error("Failed to fetch medications", error);
      Swal.fire("Error", "Could not load medications", "error");
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const handleToggleStatus = async () => {
    const newStatus = patient.status === "Active" ? "Inactive" : "Active";
    const result = await Swal.fire({
      title: `Change status to ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      const updatedPatient = { ...patient, status: newStatus };
      localStorage.setItem("patient", JSON.stringify([updatedPatient]));

      Swal.fire("Updated!", `Status changed to ${newStatus}`, "success").then(
        () => {
          window.location.reload();
        }
      );
    }
  };

  const handleUpdateProfile = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Update Profile",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Name" value="${patient.name}" />
        <input id="swal-surname" class="swal2-input" placeholder="Surname" value="${patient.surname}" />
        <input id="swal-email" class="swal2-input" placeholder="Email" value="${patient.email}" />
        <input id="swal-phone" class="swal2-input" placeholder="Phone" value="${patient.phone}" />
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          ...patient,
          name: document.getElementById("swal-name").value,
          surname: document.getElementById("swal-surname").value,
          email: document.getElementById("swal-email").value,
          phone: document.getElementById("swal-phone").value,
        };
      },
    });

    if (formValues) {
      localStorage.setItem("patient", JSON.stringify([formValues]));
      Swal.fire("Saved!", "Your profile has been updated.", "success").then(
        () => window.location.reload()
      );
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        Swal.fire("Logged Out", "You have been logged out.", "success").then(
          () => {
            window.location.href = "/"; // or "/login" if you have a dedicated login route
          }
        );
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 py-12 px-4 md:px-16">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-2">
            🧍‍♀️ Patient Profile
          </h1>
          <div className="space-x-3">
            <button
              onClick={handleUpdateProfile}
              className="px-5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white font-medium shadow"
            >
              ✏️ Update Profile
            </button>
            <button
              onClick={handleToggleStatus}
              className={`px-5 py-2 rounded-xl text-white font-medium shadow ${
                patient.status === "Active"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {patient.status === "Active" ? "Deactivate" : "Activate"}
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-xl bg-gray-700 hover:bg-gray-800 text-white font-medium shadow"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 text-sm">
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              👤 Personal Info
            </h2>
            <ul className="space-y-1 text-gray-700">
              <li>
                <strong>Full Name:</strong> {patient.name} {patient.surname}
              </li>
              <li>
                <strong>Gender:</strong> {patient.gender}
              </li>
              <li>
                <strong>Age:</strong> {patient.age}
              </li>
              <li>
                <strong>DOB:</strong> {patient.dob}
              </li>
              <li>
                <strong>Marital Status:</strong> {patient.marital_status}
              </li>
              <li>
                <strong>Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    patient.status === "Active"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {patient.status}
                </span>
              </li>
              <li>
                <strong>HIV Status:</strong> {patient.hiv_status}
              </li>
              <li>
                <strong>Allergies:</strong> {patient.allergies || "None"}
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              📞 Contact Info
            </h2>
            <ul className="space-y-1 text-gray-700">
              <li>
                <strong>Phone:</strong> {patient.phone}
              </li>
              <li>
                <strong>Email:</strong> {patient.email}
              </li>
              <li>
                <strong>Address 1:</strong> {patient.address1}
              </li>
              <li>
                <strong>Address 2:</strong> {patient.address2}
              </li>
              <li>
                <strong>ID Number:</strong> {patient.id_number}
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              🧬 Next of Kin
            </h2>
            <ul className="space-y-1 text-gray-700">
              <li>
                <strong>Name:</strong> {patient.nok_name} {patient.nok_surname}
              </li>
              <li>
                <strong>Phone:</strong> {patient.nok_phone}
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              💍 Spouse Info
            </h2>
            <ul className="space-y-1 text-gray-700">
              <li>
                <strong>Name:</strong> {patient.spouse_name || "N/A"}{" "}
                {patient.spouse_surname || ""}
              </li>
              <li>
                <strong>Phone:</strong> {patient.spouse_phone || "N/A"}
              </li>
              <li>
                <strong>Email:</strong> {patient.spouse_email || "N/A"}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-4 text-sm text-gray-500">
          <p>
            <strong>🕒 Registered On:</strong>{" "}
            {new Date(patient.time_signed).toLocaleString()}
          </p>
          <p>
            <strong>🆔 Patient ID:</strong> {patient.patient_id}
          </p>
        </div>

        {/* Recent Medications */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            💊 Recently Completed Medications
          </h2>
          {medications.filter((med) => med.consumption_status === "completed")
            .length === 0 ? (
            <p className="text-gray-500">No completed medications yet.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {medications
                .filter((med) => med.consumption_status === "completed")
                .map((med) => (
                  <li
                    key={med.medication_id}
                    className="p-4 bg-green-100 border border-green-300 rounded-lg shadow-sm"
                  >
                    <div className="font-semibold text-green-800">
                      {med.description}
                    </div>
                    <div className="text-gray-700 text-sm italic">
                      {med.consumption_description}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      <span>
                        <strong>Assigned By:</strong> {med.assigned_by}
                      </span>
                      <br />
                      <span>
                        <strong>Start:</strong>{" "}
                        {new Date(med.start_date).toLocaleDateString()}
                      </span>{" "}
                      —{" "}
                      <span>
                        <strong>End:</strong>{" "}
                        {new Date(med.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-green-600 font-semibold mt-1">
                      Status: {med.consumption_status}
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
