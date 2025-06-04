import React, { useState, useEffect } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import Calendar from 'react-calendar'
import {
  FaMoon,
  FaSun,
  FaSearch,
  FaUserMd,
  FaBell,
  FaUserCheck,
  FaUserTimes
} from 'react-icons/fa'
import classNames from 'classnames'
import 'react-calendar/dist/Calendar.css'
import '../styles/Dashboard.css'
import { URL } from '../services/endpoints'

Chart.register(...registerables)

const notifications = [
  {
    message: 'Jane Doe has an upcoming appointment on 2025-07-10.',
    type: 'info'
  },
  { message: 'Emily Smith is due for a follow-up.', type: 'warning' },
  { message: 'New patient admitted: Anna Bell.', type: 'success' }
]

export default function Dashboard () {
  const [searchTerm, setSearchTerm] = useState('')
  const [date, setDate] = useState(new Date())
  const [darkMode, setDarkMode] = useState(false)
  const [patients, setPatients] = useState([])
  const [newAdmissions, setNewAdmissions] = useState(0)
  const [chartData, setChartData] = useState({
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        label: 'Patient Status',
        data: [0, 0], // Placeholder for active and inactive counts
        backgroundColor: ['#7f5af0', '#f03e3e']
      }
    ]
  })

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(`${URL}/patient/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const result = await response.json()
        console.log(result)

        if (response.ok) {
          setPatients(result)

          // Calculate new admissions for the current month
          const currentMonth = new Date().getMonth()
          const currentYear = new Date().getFullYear()
          const monthlyAdmissionsCount = result.filter(patient => {
            const signedDate = new Date(patient.time_signed)
            return (
              signedDate.getMonth() === currentMonth &&
              signedDate.getFullYear() === currentYear
            )
          }).length

          setNewAdmissions(monthlyAdmissionsCount) // Set the new admissions count

          // Prepare data for monthly count
          const monthlyCounts = {}

          // Populate monthly counts
          result.forEach(patient => {
            const signedDate = new Date(patient.time_signed)
            const monthYear = signedDate.toLocaleString('default', {
              month: 'long',
              year: 'numeric'
            })
            monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1
          })

          // Sort by date
          const sortedMonthlyCounts = Object.entries(monthlyCounts)
            .map(([key, value]) => {
              const date = new Date(key + ' 1') // Create a date object for sorting
              return { date, value }
            })
            .sort((a, b) => a.date - b.date) // Sort by date

          // Prepare labels and data for the chart
          const labels = sortedMonthlyCounts.map(item =>
            item.date.toLocaleString('default', {
              month: 'long',
              year: 'numeric'
            })
          )
          const data = sortedMonthlyCounts.map(item => item.value)

          setChartData({
            labels,
            datasets: [
              {
                label: 'Patients Signed Per Month',
                data,
                backgroundColor: '#7f5af0'
              }
            ]
          })
        } else {
          console.error('Failed to fetch patients:', result.message)
        }
      } catch (error) {
        console.log('Error fetching patients:', error)
      }
    }

    fetchPatients()
    document.body.classList.toggle('dashboard-dark', darkMode)
  }, [darkMode])

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const patientStatus = {
    active: patients.filter(patient => patient.status === 'Active').length,
    inactive: patients.filter(patient => patient.status === 'Inactive').length
  }

  return (
    <div className={classNames('dashboard-root', { dark: darkMode })}>
      {/* Animated Background */}
      <div className='dashboard-bg'>
        <svg>
          <filter id='noiseFilter'>
            <feTurbulence
              type='fractalNoise'
              baseFrequency='0.85'
              numOctaves='2'
              stitchTiles='stitch'
            />
          </filter>
          <rect
            width='100%'
            height='100%'
            filter='url(#noiseFilter)'
            opacity='0.035'
          />
        </svg>
        <div className='dashboard-bg-blobs'>
          <div className='blob blob1'></div>
          <div className='blob blob2'></div>
        </div>
      </div>

      {/* Header */}
      <header className='dashboard-header'>
        <div className='dashboard-title'>
          <FaUserMd className='icon-md' />
          <h1>Patient Dashboard</h1>
        </div>
        <div className='dashboard-actions'>
          <button
            className='darkmode-toggle'
            aria-label={
              darkMode ? 'Switch to light mode' : 'Switch to dark mode'
            }
            onClick={() => setDarkMode(!darkMode)}
            tabIndex={0}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <div className='search-bar-container'>
            <FaSearch className='search-icon' />
            <input
              type='text'
              placeholder='Search Patients'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='search-bar'
              aria-label='Search Patients'
            />
          </div>
        </div>
      </header>

      <main className='dashboard-main'>
        {/* Analytics Overview */}
        <section className='dashboard-section analytics'>
          <h2>
            <FaBell className='section-icon' />
            Analytics Overview
          </h2>
          <div className='cards-row'>
            <div className='dashboard-card stat-card glassmorphism'>
              <div className='stat-title'>Total Patients</div>
              <div className='stat-value'>{patients.length}</div>
            </div>
            <div className='dashboard-card stat-card glassmorphism'>
              <div className='stat-title'>New Admissions</div>
              <div className='stat-value'>{newAdmissions}</div>
            </div>
            <div className='dashboard-card stat-card glassmorphism'>
              <div className='stat-title'>Upcoming Appointments</div>
              <div className='stat-value'>30</div>
            </div>
          </div>
          <div className='cards-row'>
            <div className='dashboard-card status-card glassmorphism'>
              <FaUserCheck className='status-icon active' />
              <span>
                <strong>Active:</strong> {patientStatus.active}
              </span>
            </div>
            <div className='dashboard-card status-card glassmorphism'>
              <FaUserTimes className='status-icon inactive' />
              <span>
                <strong>Inactive:</strong> {patientStatus.inactive}
              </span>
            </div>
          </div>
          <section className='dashboard-section chart-container'>
            <h2>Patients Signed Per Month</h2>
            <div className='dashboard-card chart-card glassmorphism'>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: true }
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Month/Year'
                      }
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Number of Patients'
                      },
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </section>
        </section>

        {/* Recent Patients */}
        <section className='dashboard-section patients'>
          <h2>
            <FaUserMd className='section-icon' />
            Recent Patients
          </h2>
          <div className='patients-list'>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient, idx) => (
                <div
                  className='dashboard-card patient-card glassmorphism'
                  key={patient.patient_id}
                >
                  <div className='patient-main'>
                    <img
                      src={`https://picsum.photos/seed/${encodeURIComponent(
                        patient.name
                      )}/48/48`}
                      alt={`${patient.name} avatar`}
                      className='patient-avatar'
                    />
                    <div>
                      <div className='patient-name'>{patient.name}</div>
                      <div
                        className={`patient-status ${patient.status.toLowerCase()}`}
                      >
                        {patient.status}
                      </div>
                    </div>
                  </div>
                  <div className='patient-due'>
                    <span>
                      Joined On: {patient.time_signed.split('T')[0] || 'N/A'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className='no-records glassmorphism'>No patients found.</div>
            )}
          </div>
        </section>

        {/* Calendar & Notifications */}
        <div className='grid-2'>
          <section className='dashboard-section calendar-container'>
            <h2>
              <FaBell className='section-icon' />
              Appointment Calendar
            </h2>
            <div className='dashboard-card calendar-card glassmorphism'>
              <Calendar
                onChange={setDate}
                value={date}
                className={classNames('calendar', { dark: darkMode })}
                tileClassName={({ date }) =>
                  date.toDateString() === new Date().toDateString()
                    ? 'today'
                    : undefined
                }
                prevLabel='‹'
                nextLabel='›'
                showNeighboringMonth={false}
                next2Label={null}
                prev2Label={null}
              />
            </div>
          </section>

          <section className='dashboard-section notifications'>
            <h2>
              <FaBell className='section-icon' />
              Notifications
            </h2>
            <div className='notifications-list'>
              {notifications.map((note, idx) => (
                <div
                  className={classNames(
                    'dashboard-card notification-card glassmorphism',
                    note.type
                  )}
                  key={idx}
                  tabIndex={0}
                  aria-label={note.message}
                >
                  <span className='notification-dot' />
                  <span>{note.message}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <footer className='dashboard-footer'>
        <span>
          &copy; {new Date().getFullYear()} PatientCare Portal &mdash; All
          rights reserved.
        </span>
      </footer>
    </div>
  )
}
