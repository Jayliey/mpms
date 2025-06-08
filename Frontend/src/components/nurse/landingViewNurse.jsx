import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NurseDash = () => {
  // Mock data - Replace with API calls
  const [stats, setStats] = useState({
    totalPatients: 0,
    upcomingAppointments: 0,
    recentPayments: 0,
    monthlyAdmissions: 0,
  });

  const [recentPatients, setRecentPatients] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    // TODO: Fetch actual data from your API
    const fetchData = async () => {
      // Simulated API response
      setStats({
        totalPatients: 142,
        upcomingAppointments: 8,
        recentPayments: 23,
        monthlyAdmissions: 19,
      });

      setRecentPatients([
        { id: 1, name: 'Jane Doe', trimester: 3, nextAppointment: '2025-1-15' },
        { id: 2, name: 'Mary Moyo', trimester: 2, nextAppointment: '2025-1-18' },
      ]);

      setUpcomingAppointments([
        { id: 1, patient: 'Jane Doe', date: '2025-1-15 10:00', type: 'Prenatal Checkup' },
        { id: 2, patient: 'Mary Moyo', date: '2025-1-18 14:30', type: 'Ultrasound' },
      ]);
    };
                  
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900">Maternity Dashboard</h1>
        <Link 
          to="/patients/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Patient
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Patients" 
          value={stats.totalPatients} 
          icon="👩⚕"
          color="bg-blue-100"
        />
        <StatCard 
          title="Upcoming Appointments" 
          value={stats.upcomingAppointments} 
          icon="📅"
          color="bg-green-100"
        />
        <StatCard 
          title="Recent Payments" 
          value={stats.recentPayments} 
          icon="💵"
          color="bg-purple-100"
        />
        <StatCard 
          title="Monthly Admissions" 
          value={stats.monthlyAdmissions} 
          icon="📈"
          color="bg-orange-100"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Patients</h2>
          <div className="space-y-4">
            {recentPatients.map(patient => (
              <div key={patient.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                <div>
                  <h3 className="font-medium">{patient.name}</h3>
                  <p className="text-sm text-gray-500">Trimester {patient.trimester}</p>
                </div>
                <span className="text-sm text-blue-600">
                  Next: {patient.nextAppointment}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Upcoming Appointments</h2>
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Patient</th>
                <th className="pb-2">Date & Time</th>
                <th className="pb-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {upcomingAppointments.map(appointment => (
                <tr key={appointment.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{appointment.patient}</td>
                  <td className="py-3">{appointment.date}</td>
                  <td className="py-3">
                    <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                      {appointment.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickAction 
          title="Schedule Appointment" 
          icon="➕"
          link="/appointments/new"
        />
        <QuickAction 
          title="View Reports" 
          icon="📊"
          link="/reports"
        />
        <QuickAction 
          title="Payment Records" 
          icon="💳"
          link="/payments"
        />
        <QuickAction 
          title="Staff Management" 
          icon="👥"
          link="/staff"
        />
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value, icon, color }) => (
  <div className={`${color} p-4 rounded-xl`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

// Reusable Quick Action Component
const QuickAction = ({ title, icon, link }) => (
  <Link 
    to={link}
    className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="text-center">
      <span className="text-3xl block mb-2">{icon}</span>
      <p className="text-sm font-medium text-gray-700">{title}</p>
    </div>
  </Link>
);

export default NurseDash;