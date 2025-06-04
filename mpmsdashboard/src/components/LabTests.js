import React, { useState, useMemo, useRef, useEffect } from "react";
import { labTests } from "../services/data";

// Result color styles
const RESULT_STYLES = {
  Positive: "bg-[#f1515b22] text-[#f1515b]",
  Negative: "bg-[#20be6b22] text-[#20be6b]",
  Pending: "bg-[#7f5af022] text-[#7f5af0]",
  Inconclusive: "bg-[#ffad3022] text-[#ffad30]",
  default: "bg-[#e0e5ec44] text-[#8a8f98]",
};

// LabTest Card (mobile)
function LabTestCard({ test, tabIndex, onKeyDown }) {
  return (
    <div
      className="patients-card focus:ring-2 focus:ring-[#7f5af0] focus:outline-none"
      tabIndex={tabIndex}
      role="row"
      aria-label={`Lab test ${test.test_id}`}
      onKeyDown={onKeyDown}
    >
      <div className="flex flex-col gap-1 card-info">
        <div className="card-name font-semibold text-lg mb-1">
          <span className="mr-2">#{test.test_id}</span>
          <span className={`inline-block ml-2 px-2 py-0.5 rounded-full text-xs font-medium shadow ${RESULT_STYLES[test.result] || RESULT_STYLES.default}`}>
            {test.result}
          </span>
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="card-row"><span className="font-semibold">Patient:</span> {test.patient_id}</div>
          <div className="card-row"><span className="font-semibold">Staff:</span> {test.staff_id}</div>
        </div>
        <div className="card-row"><span className="font-semibold">Type:</span> {test.test_type}</div>
        <div className="card-row"><span className="font-semibold">Ordered:</span> {test.date_ordered}</div>
        <div className="card-row"><span className="font-semibold">Result Date:</span> {test.result_date || <span className="italic opacity-60">N/A</span>}</div>
      </div>
    </div>
  );
}

// Table row (desktop)
function LabTestRow({ test, tabIndex, onKeyDown }) {
  return (
    <tr
      className="patients-row focus:ring-2 focus:ring-[#7f5af0] focus:outline-none"
      tabIndex={tabIndex}
      role="row"
      aria-label={`Lab test ${test.test_id}`}
      onKeyDown={onKeyDown}
    >
      <td>{test.test_id}</td>
      <td>{test.patient_id}</td>
      <td>{test.test_type}</td>
      <td>{test.date_ordered}</td>
      <td>
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium shadow ${RESULT_STYLES[test.result] || RESULT_STYLES.default}`}>
          {test.result}
        </span>
      </td>
      <td>{test.result_date || <span className="italic opacity-60">N/A</span>}</td>
      <td>{test.staff_id}</td>
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

// Animated background
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

export default function LabTests() {
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

  // Filter lab tests
  const filtered = useMemo(() => {
    if (!query.trim()) return labTests;
    const q = query.trim().toLowerCase();
    return labTests.filter(
      (t) =>
        String(t.test_id).includes(q) ||
        String(t.patient_id).toLowerCase().includes(q) ||
        String(t.staff_id).toLowerCase().includes(q) ||
        t.test_type.toLowerCase().includes(q) ||
        t.date_ordered.toLowerCase().includes(q) ||
        (t.result || "").toLowerCase().includes(q) ||
        (t.result_date || "").toLowerCase().includes(q)
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
          <span role="img" aria-label="test tube" className="mr-2">🧪</span>
          Lab Tests
        </h2>
        <form
          className="search-bar"
          role="search"
          aria-label="Search Lab Tests"
          onSubmit={e => e.preventDefault()}
        >
          <SearchIcon dark={isDark} />
          <input
            ref={inputRef}
            type="search"
            autoComplete="off"
            aria-label="Search lab tests"
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
          aria-label="Lab Tests"
        >
          <thead>
            <tr>
              <th scope="col">Test ID</th>
              <th scope="col">Patient ID</th>
              <th scope="col">Test Type</th>
              <th scope="col">Date Ordered</th>
              <th scope="col">Result</th>
              <th scope="col">Result Date</th>
              <th scope="col">Staff ID</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="empty">
                  <span role="img" aria-label="empty">🕳️</span> No lab tests found.
                </td>
              </tr>
            )}
            {filtered.map((test, i) => (
              <LabTestRow
                key={test.test_id}
                test={test}
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
            <span role="img" aria-label="empty">🕳️</span> No lab tests found.
          </div>
        )}
        {filtered.map((test, i) => (
          <LabTestCard
            key={test.test_id}
            test={test}
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