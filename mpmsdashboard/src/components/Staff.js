// src/components/Staff.js
import React, { useState, useMemo, useRef, useEffect } from "react";
import { staff } from "../data";

// Fun avatar colors and emojis by role
const roleAvatars = {
  doctor: "🩺",
  nurse: "💉",
  admin: "🗂️",
  technician: "🔬",
  midwife: "🧑‍🍼",
  default: "👤"
};
const avatarColors = [
  "#7f5af0", "#f6c177", "#5adbb5", "#f875aa", "#90e0ef", "#cfbaf0"
];
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}
function getAvatar(role, name) {
  const key = String(role || '').toLowerCase();
  return roleAvatars[key] || roleAvatars.default;
}

export default function Staff() {
  const [search, setSearch] = useState("");
  const searchRef = useRef();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

  useEffect(() => {
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
    if (!q) return staff;
    return staff.filter(member =>
      [member.id, member.name, member.role].join(" ").toLowerCase().includes(q)
    );
  }, [search]);

  const [announce, setAnnounce] = useState("");
  useEffect(() => {
    setAnnounce(filtered.length === 0 ? "No staff found." : "");
  }, [filtered.length]);

  return (
    <section className="patients-wrap" aria-labelledby="staff-heading" style={{marginTop:36, position:'relative'}}>
      <div className="patients-bg-anim" aria-hidden="true" />
      <header className="patients-header">
        <h2 id="staff-heading" tabIndex={-1} aria-label="Staff List">
          <svg width="29" height="29" viewBox="0 0 24 24" aria-hidden="true" style={{marginRight:8, filter:"drop-shadow(0 2px 12px #7f5af022)"}}>
            <circle cx="12" cy="12" r="10" fill="#7f5af0"/>
            <path d="M12 12c-2.5-3.5-6 0-1.5 4.5S17 12 12 12z" fill="#fff"/>
          </svg>
          Staff
        </h2>
        <form className="search-bar" role="search" aria-label="Search staff" onSubmit={e => e.preventDefault()}>
          <svg width="20" height="20" fill="none" stroke="#7f5af0" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7"/>
            <line x1="16.5" y1="16.5" x2="21" y2="21"/>
          </svg>
          <input
            ref={searchRef}
            aria-label="Search staff"
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
          <table className="patients-table" aria-label="Staff Table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Role</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="empty">No staff found.</td>
                </tr>
              )}
              {filtered.map((member, i) => (
                <tr
                  key={member.id}
                  className="patients-row"
                  tabIndex={0}
                  aria-label={`${member.name}, ${member.role}, ID ${member.id}`}
                  style={{
                    "--glass": "rgba(255,255,255,0.62)",
                    "--glass-dark": "rgba(36,39,48,0.63)",
                  }}
                >
                  <td>
                    <span className="avatar"
                      style={{
                        background: `linear-gradient(120deg, ${stringToColor(member.name+member.id)} 0%, #f6f7fb 100%)`,
                        color: "#fff"
                      }}
                      aria-label={`Avatar for ${member.name}`}
                    >{getAvatar(member.role, member.name)}</span>
                    <span style={{marginLeft:8, fontWeight:600}}>{member.id}</span>
                  </td>
                  <td style={{fontWeight:600, letterSpacing:0.2}}>{member.name}</td>
                  <td>
                    <span
                      style={{
                        display:"inline-block",
                        fontWeight:"bold",
                        fontSize:"0.98em",
                        padding:"0.14em 0.9em",
                        borderRadius:"0.8em",
                        background:"#f6f7fb",
                        color:"#7f5af0",
                        textTransform:"capitalize",
                        boxShadow:"0 1px 3px #ccc2"
                      }}
                    >{member.role}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Mobile Cards */}
        {isMobile && (
          <div className="patients-cards" role="list" aria-label="Staff Cards">
            {filtered.length === 0 && (
              <div className="empty">No staff found.</div>
            )}
            {filtered.map((member, i) => (
              <div
                key={member.id}
                className="patients-card"
                tabIndex={0}
                aria-label={`${member.name}, ${member.role}, ID ${member.id}`}
                style={{
                  "--glass": "rgba(255,255,255,0.62)",
                  "--glass-dark": "rgba(36,39,48,0.63)",
                }}
              >
                <span className="avatar"
                  style={{
                    background: `linear-gradient(120deg, ${stringToColor(member.name+member.id)} 0%, #f6f7fb 100%)`,
                    color: "#fff"
                  }}
                  aria-label={`Avatar for ${member.name}`}
                >{getAvatar(member.role, member.name)}</span>
                <div className="card-info">
                  <div className="card-name">{member.name}</div>
                  <div className="card-row"><strong>ID:</strong> {member.id}</div>
                  <div className="card-row"><strong>Role:</strong>
                    <span style={{
                      marginLeft:6,
                      fontWeight:"bold",
                      fontSize:"0.97em",
                      padding:"0.08em 0.7em",
                      borderRadius:"0.8em",
                      background:"#f6f7fb",
                      color:"#7f5af0",
                      textTransform:"capitalize",
                      boxShadow:"0 1px 3px #ccc2"
                    }}>{member.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}