// src/components/PostnatalVisits.js
import React, { useState, useMemo, useRef, useEffect } from "react";
import { postnatalVisits } from "../data";

// Fun colors for staff avatars
const avatarColors = [
  "#7f5af0", "#f6c177", "#90e0ef", "#f875aa", "#5adbb5", "#f9dc5c"
];
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export default function PostnatalVisits() {
  const [search, setSearch] = useState("");
  const searchRef = useRef();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

  useEffect(() => {
    // Keyboard shortcut for search
    function handler(e) {
      if ((e.key === "/" || e.key === "s") && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        e.preventDefault(); searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 800);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return postnatalVisits;
    return postnatalVisits.filter(visit =>
      Object.values(visit).join(" ").toLowerCase().includes(q)
    );
  }, [search]);

  const [announce, setAnnounce] = useState("");
  useEffect(() => {
    setAnnounce(filtered.length === 0 ? "No visits found." : "");
  }, [filtered.length]);

  return (
    <section className="patients-wrap" aria-labelledby="pnv-heading" style={{marginTop:36, position:'relative'}}>
      <div className="patients-bg-anim" aria-hidden="true" />
      <header className="patients-header">
        <h2 id="pnv-heading" tabIndex={-1} aria-label="Postnatal Visits">
          <svg width="29" height="29" viewBox="0 0 24 24" aria-hidden="true" style={{marginRight:8, filter:"drop-shadow(0 2px 12px #7f5af022)"}}>
            <circle cx="12" cy="12" r="10" fill="#7f5af0"/>
            <path d="M12 12.5c2.5-1.5 5 0 5 2.5s-2.5 4-5 2.5C7 19.5 9.5 16 12 12.5z" fill="#fff"/>
          </svg>
          Postnatal Visits
        </h2>
        <form className="search-bar" role="search" aria-label="Search postnatal visits" onSubmit={e => e.preventDefault()}>
          <svg width="20" height="20" fill="none" stroke="#7f5af0" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7"/>
            <line x1="16.5" y1="16.5" x2="21" y2="21"/>
          </svg>
          <input
            ref={searchRef}
            aria-label="Search postnatal visits"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoComplete="off"
            style={{minWidth: 0}}
          />
        </form>
      </header>
      <span className="sr-only" aria-live="polite">{announce}</span>

      <div className="patients-table-outer">
        {/* Desktop Table */}
        {!isMobile && (
          <table className="patients-table" aria-label="Postnatal Visits Table">
            <thead>
              <tr>
                <th scope="col">Visit ID</th>
                <th scope="col">Patient ID</th>
                <th scope="col">Visit Date</th>
                <th scope="col">Checkup Details</th>
                <th scope="col">Staff</th>
                <th scope="col">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty">No visits found.</td>
                </tr>
              )}
              {filtered.map((visit, i) => (
                <tr
                  key={visit.visit_id}
                  className="patients-row"
                  tabIndex={0}
                  aria-label={`Visit ${visit.visit_id}, Patient ${visit.patient_id}, ${visit.visit_date}, Staff ${visit.staff_id}`}
                  style={{
                    "--glass": "rgba(255,255,255,0.62)",
                    "--glass-dark": "rgba(36,39,48,0.63)",
                  }}
                >
                  <td>{visit.visit_id}</td>
                  <td>
                    <span className="avatar" style={{
                      background: `linear-gradient(120deg, #fff 0%, #f6f7fb 100%)`,
                      color: "#7f5af0"
                    }} aria-label={`Patient ${visit.patient_id}`}>
                      {visit.patient_id.slice(0,2).toUpperCase()}
                    </span>
                    <span style={{marginLeft:8, fontWeight:600}}>{visit.patient_id}</span>
                  </td>
                  <td>
                    <span style={{
                      display:"inline-block",
                      fontWeight:"bold",
                      color:"#7f5af0",
                      background:"#f6f7fb",
                      borderRadius:"0.8em",
                      padding:"0.12em 0.7em",
                      fontSize:"0.98em",
                      boxShadow:"0 1px 3px #ccc2"
                    }}>{visit.visit_date}</span>
                  </td>
                  <td>{visit.checkup_details}</td>
                  <td>
                    <span className="avatar" style={{
                      background: `linear-gradient(120deg, ${stringToColor(visit.staff_id)} 0%, #f6f7fb 100%)`,
                      color: "#fff"
                    }} aria-label={`Staff ${visit.staff_id}`}>
                      {visit.staff_id.slice(0,2).toUpperCase()}
                    </span>
                    <span style={{marginLeft:8, fontWeight:600}}>{visit.staff_id}</span>
                  </td>
                  <td>
                    {visit.notes && <span style={{
                      background: "#f6c17722",
                      borderRadius: "1em",
                      padding: "0.13em 0.7em",
                      color: "#7f5af0",
                      fontWeight: 500
                    }}>{visit.notes}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Mobile Cards */}
        {isMobile && (
          <div className="patients-cards" role="list" aria-label="Postnatal Visits Cards">
            {filtered.length === 0 && (
              <div className="empty">No visits found.</div>
            )}
            {filtered.map((visit, i) => (
              <div
                key={visit.visit_id}
                className="patients-card"
                tabIndex={0}
                aria-label={`Visit ${visit.visit_id}, Patient ${visit.patient_id}, ${visit.visit_date}, Staff ${visit.staff_id}`}
                style={{
                  "--glass": "rgba(255,255,255,0.62)",
                  "--glass-dark": "rgba(36,39,48,0.63)",
                }}
              >
                <span className="avatar" style={{
                  background: `linear-gradient(120deg, #fff 0%, #f6f7fb 100%)`,
                  color: "#7f5af0"
                }} aria-label={`Patient ${visit.patient_id}`}>
                  {visit.patient_id.slice(0,2).toUpperCase()}
                </span>
                <div className="card-info">
                  <div className="card-name">Visit {visit.visit_id}</div>
                  <div className="card-row"><strong>Patient:</strong> {visit.patient_id}</div>
                  <div className="card-row"><strong>Date:</strong> 
                    <span style={{
                      marginLeft:4,
                      fontWeight:"bold",
                      color:"#7f5af0",
                      background:"#f6f7fb",
                      borderRadius:"0.8em",
                      padding:"0.1em 0.6em",
                      fontSize:"0.97em",
                      boxShadow:"0 1px 3px #ccc2"
                    }}>{visit.visit_date}</span>
                  </div>
                  <div className="card-row"><strong>Checkup:</strong> {visit.checkup_details}</div>
                  <div className="card-row"><strong>Staff:</strong>
                    <span className="avatar" style={{
                      marginLeft: 7,
                      background: `linear-gradient(120deg, ${stringToColor(visit.staff_id)} 0%, #f6f7fb 100%)`,
                      color: "#fff",
                      width: "32px",
                      height: "32px",
                      fontSize: "1em"
                    }} aria-label={`Staff ${visit.staff_id}`}>
                      {visit.staff_id.slice(0,2).toUpperCase()}
                    </span>
                    <span style={{marginLeft:7, fontWeight:600}}>{visit.staff_id}</span>
                  </div>
                  {visit.notes && (
                  <div className="card-row">
                    <strong>Notes:</strong>
                    <span style={{
                      background: "#f6c17722",
                      borderRadius: "1em",
                      padding: "0.08em 0.5em",
                      color: "#7f5af0",
                      marginLeft:6,
                      fontWeight:500
                    }}>{visit.notes}</span>
                  </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}