import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaUserMd, FaCalendarAlt, FaBaby, FaFlask, FaPills, FaHeartbeat,
  FaChild, FaUserNurse, FaBars, FaTimes, FaMoon, FaSun
} from 'react-icons/fa';
import './StyledNavbar.css';

const navLinks = [
  { to: '/patients', label: 'Patients', icon: <FaUserMd /> },
  { to: '/appointments', label: 'Appointments', icon: <FaCalendarAlt /> },
  { to: '/deliveries', label: 'Deliveries', icon: <FaBaby /> },
  { to: '/lab-tests', label: 'Lab Tests', icon: <FaFlask /> },
  { to: '/medications', label: 'Medications', icon: <FaPills /> },
  { to: '/antenatal-visits', label: 'Antenatal Visits', icon: <FaHeartbeat /> },
  { to: '/postnatal-visits', label: 'Postnatal Visits', icon: <FaHeartbeat /> },
  { to: '/newborns', label: 'Newborns', icon: <FaChild /> },
  { to: '/staff', label: 'Staff', icon: <FaUserNurse /> },
];

export default function StyledNavbar({ mode, toggleMode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav className={`sidebar-navbar ${mode} ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span>
            <FaBaby style={{ verticalAlign: 'middle', fontSize: 24, marginRight: 8 }} />
             <Link to={"/"}>
                 <strong>Maternity PMS</strong>
              </Link>
          </span>
          <button
            className="sidebar-toggle mobile-only"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(v => !v)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <ul className="sidebar-links">
          {navLinks.map(link => (
            <li
              key={link.to}
              className={location.pathname === link.to ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              <Link to={link.to} tabIndex={0}>
                <span className="icon">{link.icon}</span>
                <span className="label">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="sidebar-bottom">
          <button
            className="sidebar-mode"
            aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
            onClick={toggleMode}
          >
            {mode === 'dark' ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </nav>
      {/* Overlay for mobile */}
      {menuOpen && <div className="sidebar-overlay mobile-only" onClick={() => setMenuOpen(false)} />}
    </>
  );
}