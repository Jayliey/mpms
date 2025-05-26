import React, { useState, useMemo, useRef, useEffect } from "react";
import { deliveries } from "../data";

const OUTCOME_STYLES = {
  "Live Birth": "bg-[#20be6b22] text-[#20be6b]",
  "Stillbirth": "bg-[#f1515b22] text-[#f1515b]",
  "Complicated": "bg-[#ffad3022] text-[#ffad30]",
  "Multiple": "bg-[#7f5af022] text-[#7f5af0]",
  default: "bg-[#e0e5ec44] text-[#8a8f98]",
};

// Delivery Card (mobile)
function DeliveryCard({ delivery, tabIndex, onKeyDown }) {
  return (
    <div
      className="patients-card focus:ring-2 focus:ring-[#7f5af0] focus:outline-none"
      tabIndex={tabIndex}
      role="row"
      aria-label={`Delivery ${delivery.delivery_id}`}
      onKeyDown={onKeyDown}
    >
      <div className="flex flex-col gap-1 card-info">
        <div className="card-name font-semibold text-lg mb-1">
          <span className="mr-2">#{delivery.delivery_id}</span>
          <span className={`inline-block ml-2 px-2 py-0.5 rounded-full text-xs font-medium shadow ${OUTCOME_STYLES[delivery.birth_outcome] || OUTCOME_STYLES.default}`}>
            {delivery.birth_outcome}
          </span>
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="card-row"><span className="font-semibold">Patient:</span> {delivery.patient_id}</div>
          <div className="card-row"><span className="font-semibold">Staff:</span> {delivery.staff_id}</div>
        </div>
        <div className="card-row"><span className="font-semibold">Type:</span> {delivery.delivery_type}</div>
        <div className="card-row"><span className="font-semibold">Date:</span> {delivery.delivery_date}</div>
        <div className="card-row"><span className="font-semibold">Notes:</span> {delivery.notes || <span className="italic opacity-60">None</span>}</div>
      </div>
    </div>
  );
}

// Table row (desktop)
function DeliveryRow({ delivery, tabIndex, onKeyDown }) {
  return (
    <tr
      className="patients-row focus:ring-2 focus:ring-[#7f5af0] focus:outline-none"
      tabIndex={tabIndex}
      role="row"
      aria-label={`Delivery ${delivery.delivery_id}`}
      onKeyDown={onKeyDown}
    >
      <td>{delivery.delivery_id}</td>
      <td>{delivery.patient_id}</td>
      <td>{delivery.delivery_date}</td>
      <td>{delivery.delivery_type}</td>
      <td>{delivery.staff_id}</td>
      <td>
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium shadow ${OUTCOME_STYLES[delivery.birth_outcome] || OUTCOME_STYLES.default}`}>
          {delivery.birth_outcome}
        </span>
      </td>
      <td>{delivery.notes || <span className="italic opacity-60">None</span>}</td>
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

// Animated gradient background
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

export default function Deliveries() {
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

  // filter deliveries
  const filtered = useMemo(() => {
    if (!query.trim()) return deliveries;
    const q = query.trim().toLowerCase();
    return deliveries.filter(
      (d) =>
        String(d.delivery_id).includes(q) ||
        String(d.patient_id).toLowerCase().includes(q) ||
        String(d.staff_id).toLowerCase().includes(q) ||
        String(d.delivery_type).toLowerCase().includes(q) ||
        String(d.delivery_date).toLowerCase().includes(q) ||
        String(d.birth_outcome).toLowerCase().includes(q) ||
        (d.notes || "").toLowerCase().includes(q)
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
          <span role="img" aria-label="delivery" className="mr-2">👶</span>
          Deliveries
        </h2>
        <form
          className="search-bar"
          role="search"
          aria-label="Search Deliveries"
          onSubmit={e => e.preventDefault()}
        >
          <SearchIcon dark={isDark} />
          <input
            ref={inputRef}
            type="search"
            autoComplete="off"
            aria-label="Search deliveries"
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
          aria-label="Deliveries"
        >
          <thead>
            <tr>
              <th scope="col">Delivery ID</th>
              <th scope="col">Patient ID</th>
              <th scope="col">Date</th>
              <th scope="col">Type</th>
              <th scope="col">Staff ID</th>
              <th scope="col">Outcome</th>
              <th scope="col">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="empty">
                  <span role="img" aria-label="empty">🕳️</span> No deliveries found.
                </td>
              </tr>
            )}
            {filtered.map((delivery, i) => (
              <DeliveryRow
                key={delivery.delivery_id}
                delivery={delivery}
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
            <span role="img" aria-label="empty">🕳️</span> No deliveries found.
          </div>
        )}
        {filtered.map((delivery, i) => (
          <DeliveryCard
            key={delivery.delivery_id}
            delivery={delivery}
            tabIndex={0}
            onKeyDown={e => onKeyDownRows(e, i)}
            aria-selected={focusIdx === i}
          />
        ))}
      </div>

      {/* Subtle overlay for material feel */}
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