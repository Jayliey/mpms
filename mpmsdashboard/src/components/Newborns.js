// src/components/Newborns.js
import React, { useState, useMemo, useRef, useEffect } from "react";
import { newborns } from "../data";

// Emoji avatars for fun, fallback to a user icon
const babyAvatars = ["👶", "🍼", "🧸", "🧑‍🍼", "🐣", "🌟", "🦄", "🐥", "🧁", "🦋"];

const statusColors = {
  vaccinated: "#b2f7b8",
  pending: "#f6c177",
  "not-vaccinated": "#ff8b7e",
};

function getStatusLabel(status) {
  if (/pending/i.test(status)) return "Pending";
  if (/not/i.test(status)) return "Not Vaccinated";
  return "Vaccinated";
}

function getStatusColor(status) {
  if (/pending/i.test(status)) return statusColors.pending;
  if (/not/i.test(status)) return statusColors["not-vaccinated"];
  return statusColors.vaccinated;
}

export default function Newborns() {
  const [search, setSearch] = useState("");
  const searchRef = useRef();

  // Focus search on "/" key
  useEffect(() => {
    function handler(e) {
      if (
        (e.key === "/" || e.key === "s") &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return newborns;
    return newborns.filter((b) =>
      Object.values(b)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [search]);

  // For accessibility: announce no results
  const [announce, setAnnounce] = useState("");
  useEffect(() => {
    if (filtered.length === 0) setAnnounce("No newborns found.");
    else setAnnounce("");
  }, [filtered.length]);

  // Responsive: table on desktop, cards on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 800);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section className="patients-wrap" aria-labelledby="newborns-heading" style={{marginTop: 36, position:'relative'}}>
      <div className="patients-bg-anim" aria-hidden="true" />
      <header className="patients-header">
        <h2 id="newborns-heading" tabIndex={-1} aria-label="Newborns List">
          <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true" style={{marginRight:8, filter:"drop-shadow(0 2px 12px #7f5af022)"}}>
            <circle cx="12" cy="12" r="10" fill="#7f5af0"/>
            <path d="M12 11c2.5-4.5 8 0 0 6-8-6 0-10 0-6z" fill="#fff"/>
          </svg>
          Newborns
        </h2>
        <form
          className="search-bar"
          role="search"
          aria-label="Search newborns"
          onSubmit={e => e.preventDefault()}
        >
          <svg width="20" height="20" fill="none" stroke="#7f5af0" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7"/>
            <line x1="16.5" y1="16.5" x2="21" y2="21"/>
          </svg>
          <input
            ref={searchRef}
            aria-label="Search newborns"
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
          <table className="patients-table" aria-label="Newborns Table">
            <thead>
              <tr>
                <th scope="col">Baby ID</th>
                <th scope="col">Delivery ID</th>
                <th scope="col">Sex</th>
                <th scope="col">Birth Weight</th>
                <th scope="col">Apgar Score</th>
                <th scope="col">Vaccination</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty">No newborns found.</td>
                </tr>
              )}
              {filtered.map((baby, i) => (
                <tr
                  key={baby.baby_id}
                  className="patients-row"
                  tabIndex={0}
                  aria-label={`Baby ${baby.baby_id}, sex ${baby.sex}, weight ${baby.birth_weight}g, Apgar ${baby.apgar_score}, ${baby.vaccination_status}`}
                  style={{
                    "--glass": "rgba(255,255,255,0.62)",
                    "--glass-dark": "rgba(36,39,48,0.63)",
                  }}
                >
                  <td>
                    <span className="avatar" aria-label={`Avatar for baby ${baby.baby_id}`}>
                      {baby.avatarImg ? (
                        <img src={baby.avatarImg} alt={`Baby ${baby.baby_id}`} />
                      ) : (
                        babyAvatars[i % babyAvatars.length]
                      )}
                    </span>
                    <span style={{marginLeft:8, fontWeight:600}}>{baby.baby_id}</span>
                  </td>
                  <td>{baby.delivery_id}</td>
                  <td>{baby.sex}</td>
                  <td>{baby.birth_weight}g</td>
                  <td>
                    <span
                      style={{
                        display:"inline-block",
                        minWidth:32,
                        textAlign:"center",
                        padding:"0.18em 0.7em",
                        borderRadius:"1em",
                        background: "#f6f7fb",
                        color: "#7f5af0",
                        fontWeight: "bold",
                        fontSize: "1.01em",
                        boxShadow: "0 1px 4px #ccc2"
                      }}
                      className="apgar-score"
                      aria-label={`Apgar score: ${baby.apgar_score}`}
                    >
                      {baby.apgar_score}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        display:"inline-block",
                        minWidth:90,
                        fontWeight:600,
                        fontSize:"1em",
                        padding:"0.2em 0.8em",
                        borderRadius:"1.2em",
                        background: getStatusColor(baby.vaccination_status),
                        color: "#23272f",
                        letterSpacing:0.5,
                        boxShadow: "0 1px 4px #ccc4"
                      }}
                      aria-label={`Vaccination status: ${getStatusLabel(baby.vaccination_status)}`}
                    >
                      {getStatusLabel(baby.vaccination_status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Mobile Cards */}
        {isMobile && (
          <div className="patients-cards" role="list" aria-label="Newborns Cards">
            {filtered.length === 0 && (
              <div className="empty">No newborns found.</div>
            )}
            {filtered.map((baby, i) => (
              <div
                key={baby.baby_id}
                className="patients-card"
                tabIndex={0}
                aria-label={`Baby ${baby.baby_id}, sex ${baby.sex}, weight ${baby.birth_weight}g, Apgar ${baby.apgar_score}, ${baby.vaccination_status}`}
                style={{
                  "--glass": "rgba(255,255,255,0.62)",
                  "--glass-dark": "rgba(36,39,48,0.63)",
                }}
              >
                <span className="avatar" aria-label={`Avatar for baby ${baby.baby_id}`}>
                  {baby.avatarImg ? (
                    <img src={baby.avatarImg} alt={`Baby ${baby.baby_id}`} />
                  ) : (
                    babyAvatars[i % babyAvatars.length]
                  )}
                </span>
                <div className="card-info">
                  <div className="card-name">{baby.baby_id}</div>
                  <div className="card-row"><strong>Delivery:</strong> {baby.delivery_id}</div>
                  <div className="card-row"><strong>Sex:</strong> {baby.sex}</div>
                  <div className="card-row"><strong>Weight:</strong> {baby.birth_weight}g</div>
                  <div className="card-row"><strong>Apgar:</strong>
                    <span
                      style={{
                        marginLeft:4,
                        padding:"0.1em 0.55em",
                        background:"#f6f7fb",
                        borderRadius:"0.8em",
                        color:"#7f5af0",
                        fontWeight:"bold",
                        fontSize:"0.99em",
                        boxShadow:"0 1px 3px #ccc2"
                      }}
                    >{baby.apgar_score}</span>
                  </div>
                  <div className="card-row">
                    <strong>Vaccination:</strong>
                    <span
                      style={{
                        marginLeft:5,
                        minWidth:74,
                        fontWeight:600,
                        fontSize:"0.98em",
                        padding:"0.11em 0.6em",
                        borderRadius:"1em",
                        background: getStatusColor(baby.vaccination_status),
                        color: "#23272f",
                        boxShadow:"0 1px 3px #ccc4"
                      }}
                    >{getStatusLabel(baby.vaccination_status)}</span>
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