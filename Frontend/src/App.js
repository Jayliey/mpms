import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientRegistration from './components/patient/patientRegistration';
import Login from './pages/loginPage';
import DashboardPage from './pages/dashboardPage';
import HomePage from './pages/homePage'
import StaffActivation from './pages/activateAccount';
import PatientHome from './components/patient/landingView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<PatientRegistration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/patient_home" element={<PatientHome />} />
        <Route path="/signup_staff" element={<StaffActivation />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App;