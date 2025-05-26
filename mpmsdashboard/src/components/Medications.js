import React, { useState, useMemo, useRef, useEffect } from "react";
import { medications } from "../data";

// Helper to color-code medication status
function getStatus(med) {
  const today = new Date();
  const start = new Date(med.start_date);
  const end = med.end_date ? new Date(med.end_date) : null;
  if (end && today > end) return "Expired";
  if (today < start) return "Future";
  if (!end || (today >= start && today <= end)) return "Active";
  return "Ongoing";
}
const STATUS_STYLES = {
  Active: "bg-[#20be6b22] text-[#20be6b]",
  Ongoing: "bg-[#7f5af022] text-[#7f5af0]",
  Expired: "bg-[#f1515b22] text-[#f1515b]",
  Future: "bg-[#f6c17722] text-[#f6c177]",
  default: "bg-[#e0e5ec44] text-[#8a8f98]",
};

// Medication Card (mobile)
function MedicationCard({ med, tabIndex, onKeyDown }) {
  const status = getStatus(med);
  return (
    <div
      className="patients-card focus:ring-2 focus:ring-[#7f5af0] focus:outline-none"
      tabIndex={tabIndex}
      role="row"
      aria-label={`Medication ${med.medication_id}`}
      onKeyDown={onKeyDown}
    >
      <div className="flex flex-col gap-1 card-info">
        <div className="card-name font-semibold text-lg mb-1">
          <span className="mr-2">#{med.medication_id}</span>
          <span className={`inline-block ml-2 px-2 py-0.5 rounded-full text-xs font-medium shadow ${STATUS_STYLES[status] || STATUS_STYLES.default}`}>
            {status}
          </span>
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="card-row"><span className="font-semibold">Patient:</span> {med.patient_id}</div>
          <div className="card-row"><span className="font-semibold">Prescribed by:</span> {med.prescribed_by}</div>
        </div>
        <div className="card-row"><span className="font-semibold">Drug:</span> {med.drug_name}</div>
        <div className="card-row"><span className="font-semibold">Dosage:</span> {med.dosage}</div>
        <div className="card-row"><span className="font-semibold">Start:</span> {med.start_date}</div>
        <div className="card-row"><span className="font-semibold">End:</span> {med.end_date || <span className="italic opacity-60">Ongoing</span>}</div>
      </div>
    </div>
  );
}

// Table row (desktop)
function MedicationRow({ med, tabIndex, onKeyDown }) {
  const status = getStatus(med);
  return (
    <tr
      className="patients-row focus:ring-2 focus:ring-[#7f5af0] focus:outline-none"
      tabIndex={tabIndex}
      role="row"
      aria-label={`Medication ${med.medication_id}`}
      onKeyDown={onKeyDown}
    >
      <td>{med.medication_id}</td>
      <td>{med.patient_id}</td>
      <td>{med.drug_name}</td>
      <td>{med.dosage}</td>
      <td>{med.start_date}</td>
      <td>{med.end_date || <span className="italic opacity-60">Ongoing</span>}</td>
      <td>
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium shadow ${STATUS_STYLES[status] || STATUS_STYLES.default}`}>
          {med.prescribed_by}
        </span>
      </td>
    </tr>
  );
}

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

// Animated glassy background
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

export default function Medications() {
  const [query, setQuery] = useState("");
  const [focusIdx, setFocusIdx] = useState(-1);
  const [isDark, setIsDark] = useState(() =>
    typeof window !== "undefined"
      ? (document.body.getAttribute("data-theme") === "dark" || document.body.classList.contains("dark"))
      : false
  );
  const inputRef = useRef();

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

  // Filter medications
  const filtered = useMemo(() => {
    if (!query.trim()) return medications;
    const q = query.trim().toLowerCase();
    return medications.filter(
      (m) =>
        String(m.medication_id).includes(q) ||
        String(m.patient_id).toLowerCase().includes(q) ||
        String(m.prescribed_by).toLowerCase().includes(q) ||
        m.drug_name.toLowerCase().includes(q) ||
        m.dosage.toLowerCase().includes(q) ||
        (m.start_date || "").toLowerCase().includes(q) ||
        (m.end_date || "").toLowerCase().includes(q)
    );
  }, [query]);

  // Keyboard navigation
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
          <span role="img" aria-label="pill" className="mr-2">💊</span>
          Medications
        </h2>
        <form
          className="search-bar"
          role="search"
          aria-label="Search Medications"
          onSubmit={e => e.preventDefault()}
        >
          <SearchIcon dark={isDark} />
          <input
            ref={inputRef}
            type="search"
            autoComplete="off"
            aria-label="Search medications"
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
          aria-label="Medications"
        >
          <thead>
            <tr>
              <th scope="col">Medication ID</th>
              <th scope="col">Patient ID</th>
              <th scope="col">Drug Name</th>
              <th scope="col">Dosage</th>
              <th scope="col">Start Date</th>
              <th scope="col">End Date</th>
              <th scope="col">Prescribed By</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="empty">
                  <span role="img" aria-label="empty">🕳️</span> No medications found.
                </td>
              </tr>
            )}
            {filtered.map((med, i) => (
              <MedicationRow
                key={med.medication_id}
                med={med}
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
            <span role="img" aria-label="empty">🕳️</span> No medications found.
          </div>
        )}
        {filtered.map((med, i) => (
          <MedicationCard
            key={med.medication_id}
            med={med}
            tabIndex={0}
            onKeyDown={e => onKeyDownRows(e, i)}
            aria-selected={focusIdx === i}
          />
        ))}
      </div>

      {/* Subtle overlay for glassy/material feel */}
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