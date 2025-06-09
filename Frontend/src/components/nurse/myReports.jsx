import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function Reports() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state to show details on clicking cards
  const [selectedReport, setSelectedReport] = useState(null);

  // Load nurse from localStorage
  const nurse = JSON.parse(localStorage.getItem("nurse")) || {};

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [aRes, pRes, mRes] = await Promise.all([
          axios.get("http://localhost:3001/appointment/"),
          axios.get("http://localhost:3001/patient/"),
          axios.get("http://localhost:3001/medication/"),
        ]);

        // Filter appointments by nurse's staff_id
        const nurseAppointments = aRes.data.filter(
          (appt) => appt.staff_id === nurse.staff_id
        );

        setAppointments(nurseAppointments);
        setPatients(pRes.data);
        setMedications(mRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
      setLoading(false);
    }
    fetchData();
  }, [nurse.staff_id]);

  // Helper to get patient full name by id
  const getPatientName = (patientId) => {
    const patient = patients.find((p) => p.patient_id === patientId);
    return patient ? `${patient.name} ${patient.surname}` : "Unknown";
  };

  // --- Stats for cards ---

  const totalAppointments = appointments.length;
  const scheduledAppointments = appointments.filter(
    (a) => a.status === "Scheduled"
  ).length;
  const completedAppointments = appointments.filter(
    (a) => a.status === "Completed"
  ).length;
  const pendingPayments = appointments.filter(
    (a) => a.payment_status === "Pending"
  ).length;

  // Medications for patients assigned to this nurse (by patient_id matching medications)
  const nursePatientIds = [...new Set(appointments.map((a) => a.patient_id))];
  const nurseMedications = medications.filter((m) =>
    nursePatientIds.includes(m.patient_id)
  );

  const inProgressMeds = nurseMedications.filter(
    (m) => m.consumption_status === "inprogress"
  ).length;
  const pendingMeds = nurseMedications.filter(
    (m) => m.consumption_status === "pending"
  ).length;

  // --- Chart Data ---

  // Pie chart for appointment status breakdown
  const apptStatusCounts = appointments.reduce((acc, appt) => {
    acc[appt.status] = (acc[appt.status] || 0) + 1;
    return acc;
  }, {});
  const apptStatusLabels = Object.keys(apptStatusCounts);
  const apptStatusData = Object.values(apptStatusCounts);

  const apptStatusPieData = {
    labels: apptStatusLabels,
    datasets: [
      {
        label: "Appointment Status",
        data: apptStatusData,
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0"],
        hoverOffset: 10,
      },
    ],
  };

  // Bar chart: Medications by consumption_status
  const medStatusCounts = nurseMedications.reduce((acc, med) => {
    acc[med.consumption_status] = (acc[med.consumption_status] || 0) + 1;
    return acc;
  }, {});
  const medStatusLabels = Object.keys(medStatusCounts);
  const medStatusData = Object.values(medStatusCounts);

  const medStatusBarData = {
    labels: medStatusLabels,
    datasets: [
      {
        label: "Medications by status",
        data: medStatusData,
        backgroundColor: "#4BC0C0",
      },
    ],
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Reports for Nurse {nurse.name}</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
        <Card
          title="Total Appointments"
          count={totalAppointments}
          onClick={() => setSelectedReport("appointments")}
        />
        <Card
          title="Scheduled Appointments"
          count={scheduledAppointments}
          onClick={() => setSelectedReport("appointments")}
        />
        <Card
          title="Completed Appointments"
          count={completedAppointments}
          onClick={() => setSelectedReport("appointments")}
        />
        <Card
          title="Pending Payments"
          count={pendingPayments}
          onClick={() => setSelectedReport("appointments")}
        />
        <Card
          title="Medications (All)"
          count={nurseMedications.length}
          onClick={() => setSelectedReport("medications")}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        <section className="bg-white rounded shadow p-6">
          <h2 className="font-semibold mb-4 text-lg">Appointment Status Breakdown</h2>
          <Pie data={apptStatusPieData} />
        </section>

        <section className="bg-white rounded shadow p-6">
          <h2 className="font-semibold mb-4 text-lg">Medications by Consumption Status</h2>
          <Bar data={medStatusBarData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
        </section>
      </div>

      {/* Detailed Tables based on selected card */}
      <section className="bg-white rounded shadow p-6">
        {selectedReport === "appointments" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Appointments Details</h2>
            <AppointmentsTable
              appointments={appointments}
              getPatientName={getPatientName}
            />
          </>
        )}

        {selectedReport === "medications" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Medications Details</h2>
            <MedicationsTable medications={nurseMedications} getPatientName={getPatientName} />
          </>
        )}

        {!selectedReport && (
          <p className="text-gray-500 italic">Click a card above to see detailed data here.</p>
        )}
      </section>
    </div>
  );
}

// Summary Card Component
function Card({ title, count, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white p-6 rounded shadow hover:shadow-lg transition"
    >
      <h3 className="text-sm text-gray-600">{title}</h3>
      <p className="mt-2 text-3xl font-bold">{count}</p>
    </div>
  );
}

// Table to show appointments
function AppointmentsTable({ appointments, getPatientName }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2">ID</th>
            <th className="border border-gray-300 px-3 py-2">Patient</th>
            <th className="border border-gray-300 px-3 py-2">Description</th>
            <th className="border border-gray-300 px-3 py-2">Category</th>
            <th className="border border-gray-300 px-3 py-2">Status</th>
            <th className="border border-gray-300 px-3 py-2">Payment Status</th>
            <th className="border border-gray-300 px-3 py-2">Cost</th>
            <th className="border border-gray-300 px-3 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.appointment_id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-3 py-2">{appt.appointment_id}</td>
              <td className="border border-gray-300 px-3 py-2">{getPatientName(appt.patient_id)}</td>
              <td className="border border-gray-300 px-3 py-2">{appt.description}</td>
              <td className="border border-gray-300 px-3 py-2 capitalize">{appt.appointment_category}</td>
              <td className="border border-gray-300 px-3 py-2 capitalize">{appt.status}</td>
              <td className="border border-gray-300 px-3 py-2 capitalize">{appt.payment_status}</td>
              <td className="border border-gray-300 px-3 py-2">${parseFloat(appt.cost).toFixed(2)}</td>
              <td className="border border-gray-300 px-3 py-2">{new Date(appt.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Table to show medications
function MedicationsTable({ medications, getPatientName }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2">ID</th>
            <th className="border border-gray-300 px-3 py-2">Patient</th>
            <th className="border border-gray-300 px-3 py-2">Description</th>
            <th className="border border-gray-300 px-3 py-2">Assigned By</th>
            <th className="border border-gray-300 px-3 py-2">Start Date</th>
            <th className="border border-gray-300 px-3 py-2">End Date</th>
            <th className="border border-gray-300 px-3 py-2">Status</th>
            <th className="border border-gray-300 px-3 py-2">Consumption Description</th>
          </tr>
        </thead>
        <tbody>
          {medications.map((med) => (
            <tr key={med.medication_id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-3 py-2">{med.medication_id}</td>
              <td className="border border-gray-300 px-3 py-2">{getPatientName(med.patient_id)}</td>
              <td className="border border-gray-300 px-3 py-2">{med.description}</td>
              <td className="border border-gray-300 px-3 py-2">{med.assigned_by}</td>
              <td className="border border-gray-300 px-3 py-2">{new Date(med.start_date).toLocaleDateString()}</td>
              <td className="border border-gray-300 px-3 py-2">{new Date(med.end_date).toLocaleDateString()}</td>
              <td className="border border-gray-300 px-3 py-2 capitalize">{med.consumption_status}</td>
              <td className="border border-gray-300 px-3 py-2">{med.consumption_description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
