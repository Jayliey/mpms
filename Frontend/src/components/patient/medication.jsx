import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

const MEDICATION_API = "http://localhost:3001/medication";
const APPOINTMENT_API = "http://localhost:3001/appointment";
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00c49f", "#ff6666"];

const PatientMedications = () => {
  const patient = JSON.parse(localStorage.getItem("patient"))?.[0];
  const [medications, setMedications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await fetch(
          `${MEDICATION_API}/patient/${patient.patient_id}`
        );
        const data = await response.json();
        setMedications(data);
      } catch (error) {
        console.error("Failed to fetch medications", error);
        Swal.fire("Error", "Could not load medications", "error");
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `${APPOINTMENT_API}/patient/${patient.patient_id}`
        );
        const data = await response.json();

        const completed = data.filter((appt) => appt.status === "Completed");
        setAppointments(completed);
        setAllAppointments(data); // Keep all appointments for chart
      } catch (error) {
        console.error("Failed to fetch appointments", error);
        Swal.fire("Error", "Could not load appointments", "error");
      }
    };

    if (patient?.patient_id) {
      fetchMedications();
      fetchAppointments();
    }
  }, [patient?.patient_id]);

  const handleMarkCompleted = async (id) => {
    const result = await Swal.fire({
      title: "Mark this medication as completed?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, mark completed",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${MEDICATION_API}/medupdate/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            column: "consumption_status",
            value: "completed",
          }),
        });

        if (response.ok) {
          Swal.fire("Updated!", "Medication marked as completed.", "success");

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

  // Prepare chart data by counting appointments by status
  const chartData = Object.entries(
    allAppointments.reduce((acc, appt) => {
      acc[appt.status] = (acc[appt.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({ status, count }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">
        Your Medications
      </h1>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-4">
        {["all", "pending", "completed"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded ${
              filter === type
                ? type === "completed"
                  ? "bg-green-600 text-white"
                  : type === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Medications */}
      {filteredMedications.length === 0 ? (
        <p className="text-gray-500">No medications to display.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {filteredMedications.map((med) => (
            <div
              key={med.medication_id}
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition">
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
                  }`}>
                  {med.consumption_status.toUpperCase()}
                </span>
              </p>
              {med.consumption_status !== "completed" && (
                <button
                  onClick={() => handleMarkCompleted(med.medication_id)}
                  className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                  Mark as Completed
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Completed Appointments */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">
          Completed Appointments
        </h2>

        {appointments.length === 0 ? (
          <p className="text-gray-500">No completed appointments found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((appt) => (
              <div
                key={appt.appointment_id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
                <h3 className="text-lg font-semibold text-gray-800">
                  {appt.description}
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>Category:</strong> {appt.appointment_category}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Date:</strong>{" "}
                  {new Date(appt.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-green-600 font-medium">
                  Status: {appt.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appointment Chart */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          Appointment Status Overview
        </h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No appointments available for chart.</p>
        )}
      </div>

   <div className="mt-16">
  <h2 className="text-2xl font-bold text-blue-700 mb-6">
    Appointment Status Overview
  </h2>
  {chartData.length > 0 ? (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart width={400} height={300}>
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  ) : (
    <p className="text-gray-500">No appointments available for chart.</p>
  )}
</div>

    </div>
  );
};

export default PatientMedications;
