import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientRegistration from './components/patient/patientRegistration';
import Login from './pages/loginPage';
import DashboardPage from './pages/dashboardPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<PatientRegistration />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  )
}

export default App;