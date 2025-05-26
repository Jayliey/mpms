import React, { useState } from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { patients } from "../data";
import "./Patients.css";

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const Patients = () => {
  const [query, setQuery] = useState("");

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.phone.includes(query) ||
      String(p.id).includes(query)
  );

  return (
    <div className="patients-wrap">
      <div className="patients-bg-anim" aria-hidden="true"></div>
      <div className="patients-header">
        <h2>
          <FaUserCircle style={{ marginRight: 8, verticalAlign: "middle" }} />
          Patients
        </h2>
        <div className="search-bar" role="search">
          <FaSearch aria-label="Search" />
          <input
            type="text"
            placeholder="Search patients..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search patients"
          />
        </div>
      </div>
      <div className="patients-table-outer">
        <table className="patients-table" aria-label="Patients Table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Profile</th>
              <th>Name</th>
              <th>Age</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="empty">No patients found.</div>
                </td>
              </tr>
            ) : (
              filtered.map((patient, i) => (
                <tr
                  key={patient.id}
                  tabIndex={0}
                  className="patients-row"
                  style={{ animationDelay: `${0.07 * i}s` }}
                  onClick={() => alert(`Patient: ${patient.name}`)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      alert(`Patient: ${patient.name}`);
                    }
                  }}
                  aria-label={`Patient ${patient.name}`}
                >
                  <td>{patient.id}</td>
                  <td>
                    <div className="avatar">
                      {patient.avatar ? (
                        <img src={patient.avatar} alt={patient.name} />
                      ) : (
                        <span>{getInitials(patient.name)}</span>
                      )}
                    </div>
                  </td>
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.phone}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Mobile Cards */}
        <div className="patients-cards">
          {filtered.length === 0 ? (
            <div className="empty">No patients found.</div>
          ) : (
            filtered.map((patient, i) => (
              <div
                className="patients-card"
                key={patient.id}
                tabIndex={0}
                style={{ animationDelay: `${0.06 * i}s` }}
                onClick={() => alert(`Patient: ${patient.name}`)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    alert(`Patient: ${patient.name}`);
                  }
                }}
                aria-label={`Patient ${patient.name}`}
              >
                <div className="avatar">
                  {patient.avatar ? (
                    <img src={patient.avatar} alt={patient.name} />
                  ) : (
                    <span>{getInitials(patient.name)}</span>
                  )}
                </div>
                <div className="card-info">
                  <div className="card-name">{patient.name}</div>
                  <div className="card-row">
                    <span>ID:</span> {patient.id}
                  </div>
                  <div className="card-row">
                    <span>Age:</span> {patient.age}
                  </div>
                  <div className="card-row">
                    <span>Phone:</span> {patient.phone}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Patients;