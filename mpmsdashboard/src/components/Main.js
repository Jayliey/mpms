import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Register Chart.js components
Chart.register(...registerables);

const Dashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [date, setDate] = useState(new Date());

    const patients = [
        { name: 'Jane Doe', dueDate: '2025-07-15', status: 'Active' },
        { name: 'Emily Smith', dueDate: '2025-08-25', status: 'Inactive' },
        { name: 'Sarah Johnson', dueDate: '2025-09-05', status: 'Active' },
        { name: 'Anna Bell', dueDate: '2025-06-20', status: 'Active' },
        { name: 'Lisa White', dueDate: '2025-09-15', status: 'Inactive' },
    ];

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'New Admissions',
                data: [10, 20, 15, 25, 30, 22],
                borderColor: '#7f5af0',
                backgroundColor: 'rgba(127, 90, 240, 0.2)',
                fill: true,
            },
        ],
    };

    const patientStatus = {
        active: patients.filter(patient => patient.status === 'Active').length,
        inactive: patients.filter(patient => patient.status === 'Inactive').length,
    };

    const notifications = [
        { message: 'Jane Doe has an upcoming appointment on 2025-07-10.', type: 'info' },
        { message: 'Emily Smith is due for a follow-up.', type: 'warning' },
        { message: 'New patient admitted: Anna Bell.', type: 'success' },
    ];

    return (
        <div className="main-content">
            <div className="header">
                <h1>Dashboard</h1>
                <input
                    type="text"
                    placeholder="Search Patients"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                />
            </div>
            <div className="analytics">
                <h2>Analytics Overview</h2>
                <div className="card statistics">
                    <strong>Total Patients:</strong> {patients.length}
                    <strong>New Admissions:</strong> 15
                    <strong>Upcoming Appointments:</strong> 30
                </div>
                <div className="status-summary">
                    <div className="status-card">
                        <strong>Active Patients:</strong> {patientStatus.active}
                    </div>
                    <div className="status-card">
                        <strong>Inactive Patients:</strong> {patientStatus.inactive}
                    </div>
                </div>
                <div className="chart">
                    <Line data={data} />
                </div>
            </div>
            <div className="patients">
                <h2>Recent Patients</h2>
                {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient, index) => (
                        <div className="card" key={index}>
                            <strong>{patient.name}</strong> - Due Date: {patient.dueDate} - Status: {patient.status}
                        </div>
                    ))
                ) : (
                    <p>No patients found.</p>
                )}
            </div>
            <div className="calendar-container">
                <h2>Appointment Calendar</h2>
                <Calendar
                    onChange={setDate}
                    value={date}
                    className="calendar"
                />
            </div>
            <div className="notifications">
                <h2>Notifications</h2>
                {notifications.map((note, index) => (
                    <div className={`notification ${note.type}`} key={index}>
                        {note.message}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;