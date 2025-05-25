import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientRegistration from './components/patient/patientRegistration';
import LoginPage from './pages/loginPage';
import DashboardPage from './pages/dashboardPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PatientRegistration />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  )
}

export default App;