import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Appointments from './components/Appointments';
import Deliveries from './components/Deliveries';
import LabTests from './components/LabTests';
import Medications from './components/Medications';
import AntenatalVisits from './components/AntenatalVisits';
import PostnatalVisits from './components/PostnatalVisits';
import Newborns from './components/Newborns';
import Patients from './components/Patients';
import Staff from './components/Staff';
import StyledNavbar from './components/StyleNavbar';
import './App.css';
import Dashboard from './components/Main';
import Login from './onboarding/Login';
import Signup from './onboarding/Signup';

function App() {
  const [mode, setMode] = useState('light');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // New state for authentication

  const toggleMode = () => setMode(m => (m === 'dark' ? 'light' : 'dark'));

  React.useEffect(() => {
    document.body.className = mode;
    document.body.style.background =
      mode === 'dark'
        ? 'linear-gradient(120deg,#23272f 0%,#282c34 100%)'
        : 'linear-gradient(120deg,#e0e5ec 0%,#f6f7fb 100%)';
    document.body.style.transition = 'background 0.5s cubic-bezier(.4,2,.6,1)';
  }, [mode]);

  const handleLogin = () => {
    setIsAuthenticated(true); // Update authentication status on login
  };

return (
  <Router>
    {isAuthenticated && <StyledNavbar mode={mode} toggleMode={toggleMode} />}
    <main
      style={{
        marginLeft: isAuthenticated ? '250px' : '0',
        padding: '2.5rem 2rem 2rem 2rem',
        transition: 'margin-left 0.3s cubic-bezier(.4,2,.6,1)',
        minHeight: '100vh',
      }}
    >
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path='/dash' element={<Dashboard />} />
            <Route path='/patients' element={<Patients />} />
            <Route path='/appointments' element={<Appointments />} />
            <Route path='/deliveries' element={<Deliveries />} />
            <Route path='/lab-tests' element={<LabTests />} />
            <Route path='/medications' element={<Medications />} />
            <Route path='/antenatal-visits' element={<AntenatalVisits />} />
            <Route path='/postnatal-visits' element={<PostnatalVisits />} />
            <Route path='/newborns' element={<Newborns />} />
            <Route path='/staff' element={<Staff />} />
            <Route path='*' element={<Navigate to="/dash" replace />} />
          </>
        ) : (
          <>
            <Route path='/' element={<Login onLogin={handleLogin} />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='*' element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </main>
  </Router>
);
}

export default App;