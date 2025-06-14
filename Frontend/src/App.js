import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientRegistration from './components/patient/patientRegistration';
import Login from './pages/loginPage';
import DashboardPage from './pages/dashboardPage';
import HomePage from './pages/homePage'
import StaffActivation from './pages/activateAccount';
import PatientHome from './components/patient/landingView';
import PatientProfile from './components/patient/patientDetails';
import PatientMedications from './components/patient/medication';
import PaymentHistory from './components/patient/paymentRecords';
import NurseDash from './components/nurse/landingViewNurse';
import DoctorDash from './components/doctor/landingViewDoc';
import SearchPatientsPage from './components/nurse/searchPatient';
import SellMedicationPage from './components/nurse/sellPage';
import PaymentHistoryNurse from './components/nurse/paymentDash';
import Reports from './components/nurse/myReports';
import PatientSignUp from './pages/patientSignUp';
import ReportsDoc from './components/doctor/myDocReports';
import SearchPatients from './components/doctor/searchPatientDoc';
import PrescriptionPage from './components/doctor/PrescriptionPage';
import CreateAppointmentPage from './components/doctor/scheduleAppointment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<PatientRegistration />} />
        <Route path="/signup_two" element={<PatientSignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/patient_home" element={<PatientHome />} />
        <Route path="/nurse_home" element={<NurseDash />} />
        <Route path="/doctor_home" element={<DoctorDash />} />
        <Route path="/doctor_prescribe" element={<PrescriptionPage />} />
        <Route path="/patient_profile" element={<PatientProfile />} />
        <Route path="/search_patient" element={<SearchPatientsPage />} />
        <Route path="/search_patient_doc" element={<SearchPatients />} />
        <Route path="/create_appointment_doc" element={<CreateAppointmentPage />} />
        <Route path="/signup_staff" element={<StaffActivation />} />
        <Route path="/sell" element={<SellMedicationPage />} />
        <Route path="/reports" element={<PatientMedications />} />
        <Route path="/reports_nurse" element={<Reports />} />
        <Route path="/reports_doctor" element={<ReportsDoc />} />
        <Route path="/payment_records" element={<PaymentHistory />} />
        <Route path="/payment_records_dash" element={<PaymentHistoryNurse />}/>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App;