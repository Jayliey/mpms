import React, { useState, useMemo, useRef, useEffect } from "react";
import { appointments } from "../data";

// Status colors
const STATUS_STYLES = {
  Scheduled: "bg-[#7f5af020] text-[#7f5af0]",
  Completed: "bg-[#20be6b22] text-[#20be6b]",
  Cancelled: "bg-[#f1515b22] text-[#f1515b]",
  Pending: "bg-[#f6c17722] text-[#f6c177]",
  Missed: "bg-[#ffad3022] text-[#ffad30]",
  default: "bg-[#e0e5ec44] text-[#8a8f98]",
};

// Appointment Card (mobile)
function AppointmentCard({ appt, tabIndex, onKeyDown }) {
  return (
    <div
      className="patients-card focus:ring-2 focus:ring-[#7f5af0] focus:outline-none"
      tabIndex={tabIndex}
      role="row"
      aria-label={`Appointment ${appt.appointment_id}`}
      onKeyDown={onKeyDown}
    >
      <div className="flex flex-col gap-1 card-info">
        <div className="card-name font-semibold text-lg mb-1">
          <span className="mr-2">#{appt.appointment_id}</span>
          <span className={`inline-block ml-2 px-2 py-0.5 rounded-full text-xs font-medium shadow ${STATUS_STYLES[appt.status] || STATUS_STYLES.default}`}>
            {appt.status}
          </span>
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="card-row"><span className="font-semibold">Patient:</span> {appt.patient_id}</div>
          <div className="card-row"><span className="font-semibold">Staff:</span> {appt.staff_id}</div>
        </div>
        <div className="card-row"><span className="font-semibold">Type:</span> {appt.appointment_type}</div>
        <div className="card-row"><span className="font-semibold">Date:</span> {appt.date}</div>
        <div className="card-row"><span className="font-semibold">Time:</span> {appt.time}</div>
      </div>
    </div>
  );
}

// Table row (desktop)
function AppointmentRow({ appt, tabIndex, onKeyDown }) {
  return (
    <tr
      className="patients-row focus:ring-2 focus:ring-[#7f5af0] focus:outline-none"
      tabIndex={tabIndex}
      role="row"
      aria-label={`Appointment ${appt.appointment_id}`}
      onKeyDown={onKeyDown}
    >
      <td>{appt.appointment_id}</td>
      <td>{appt.patient_id}</td>
      <td>{appt.staff_id}</td>
      <td>{appt.appointment_type}</td>
      <td>{appt.date}</td>
      <td>{appt.time}</td>
      <td>
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium shadow ${STATUS_STYLES[appt.status] || STATUS_STYLES.default}`}>
          {appt.status}
        </span>
      </td>
    </tr>
  );
}

const AnimatedBg = () => (
  <div
    className="absolute inset-0 patients-bg-anim pointer-events-none"
    aria-hidden="true"
    style={{
      zIndex: 0,
      backgroundBlendMode: "overlay",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
    }}
  />
);

// SVG search icon
const SearchIcon = ({ dark }) => (
  <svg
    width="21"
    height="21"
    fill="none"
    aria-hidden="true"
    viewBox="0 0 24 24"
    className={`transition-colors ${dark ? "text-[#f6c177]" : "text-[#7f5af0]"}`}
  >
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
    <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default function Appointments() {
  const [query, setQuery] = useState("");
  const [focusIdx, setFocusIdx] = useState(-1);
  const [isDark, setIsDark] = useState(() =>
    typeof window !== "undefined"
      ? (document.body.getAttribute("data-theme") === "dark" || document.body.classList.contains("dark"))
      : false
  );
  const inputRef = useRef();

  // Handle theme changes (optional: listen to changes)
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(
        document.body.getAttribute("data-theme") === "dark" ||
        document.body.classList.contains("dark")
      );
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => observer.disconnect();
  }, []);

  // Filtered appointments
  const filtered = useMemo(() => {
    if (!query.trim()) return appointments;
    const q = query.trim().toLowerCase();
    return appointments.filter(
      (a) =>
        String(a.appointment_id).includes(q) ||
        String(a.patient_id).toLowerCase().includes(q) ||
        String(a.staff_id).toLowerCase().includes(q) ||
        a.appointment_type.toLowerCase().includes(q) ||
        a.date.toLowerCase().includes(q) ||
        a.time.toLowerCase().includes(q) ||
        a.status.toLowerCase().includes(q)
    );
  }, [query]);

  // Keyboard navigation (arrows)
  const onKeyDownRows = (e, n) => {
    if (["ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      setFocusIdx((prev) => {
        if (e.key === "ArrowDown") return Math.min(filtered.length - 1, prev + 1);
        if (e.key === "ArrowUp") return Math.max(0, prev - 1);
        return prev;
      });
    } else if (e.key === "Escape") {
      setFocusIdx(-1);
      inputRef.current?.focus();
    }
  };

  return (
    <section className="patients-wrap relative px-1 md:px-4 py-4 sm:py-7">
      {/* ANIMATED GLASSY BACKGROUND */}
      <AnimatedBg />

      {/* Header */}
      <header className="patients-header mb-6">
        <h2>
          <span role="img" aria-label="calendar" className="mr-2">📅</span>
          Appointments
        </h2>
        <form
          className="search-bar"
          role="search"
          aria-label="Search Appointments"
          onSubmit={e => e.preventDefault()}
        >
          <SearchIcon dark={isDark} />
          <input
            ref={inputRef}
            type="search"
            autoComplete="off"
            aria-label="Search appointments"
            placeholder="Search…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="transition-colors"
            style={{ minWidth: 110 }}
          />
        </form>
      </header>

      {/* Table (Desktop) */}
      <div className="patients-table-outer hidden md:block relative z-2">
        <table
          className="patients-table"
          role="table"
          aria-label="Appointments"
        >
          <thead>
            <tr>
              <th scope="col">Appointment ID</th>
              <th scope="col">Patient ID</th>
              <th scope="col">Staff ID</th>
              <th scope="col">Type</th>
              <th scope="col">Date</th>
              <th scope="col">Time</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="empty">
                  <span role="img" aria-label="empty">🕳️</span> No appointments found.
                </td>
              </tr>
            )}
            {filtered.map((appt, i) => (
              <AppointmentRow
                key={appt.appointment_id}
                appt={appt}
                tabIndex={0}
                onKeyDown={e => onKeyDownRows(e, i)}
                aria-selected={focusIdx === i}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards (Mobile) */}
      <div className="patients-cards block md:hidden z-2">
        {filtered.length === 0 && (
          <div className="empty">
            <span role="img" aria-label="empty">🕳️</span> No appointments found.
          </div>
        )}
        {filtered.map((appt, i) => (
          <AppointmentCard
            key={appt.appointment_id}
            appt={appt}
            tabIndex={0}
            onKeyDown={e => onKeyDownRows(e, i)}
            aria-selected={focusIdx === i}
          />
        ))}
      </div>

      {/* Subtle overlay for visual pop */}
      <div
        style={{
          pointerEvents: "none",
          zIndex: 0,
          position: "absolute",
          inset: 0,
          background:
            "url('https://www.transparenttextures.com/patterns/noise.png') repeat",
          opacity: isDark ? 0.13 : 0.08,
          mixBlendMode: "overlay",
          borderRadius: "1.3rem",
        }}
        aria-hidden="true"
      />
    </section>
  );
}