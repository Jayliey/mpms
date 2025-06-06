import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientRegistration from './components/patient/patientRegistration';
import Login from './pages/loginPage';
import DashboardPage from './pages/dashboardPage';
import HomePage from './pages/homePage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<PatientRegistration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App;