import React, { useState, useMemo, useRef, useEffect } from "react";
import { appointments as initialAppointments } from "../services/data";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";

// ---- STATUS STYLES ----
const STATUS_STYLES = {
  Scheduled: "bg-[#7f5af022] text-[#7f5af0] border-[#7f5af0]",
  Completed: "bg-[#20be6b22] text-[#20be6b] border-[#20be6b]",
  Cancelled: "bg-[#f1515b22] text-[#f1515b] border-[#f1515b]",
  Pending: "bg-[#f6c17722] text-[#f6c177] border-[#f6c177]",
  Missed: "bg-[#ffad3022] text-[#ffad30] border-[#ffad30]",
  default: "bg-[#e0e5ec44] text-[#8a8f98] border-[#b3bdd7]",
};
const STATUS_LIST = ["Scheduled", "Completed", "Cancelled", "Pending", "Missed"];

// ---- COLOR PALETTE ----
const auroraGradLight = "linear-gradient(120deg,#e0e5ec 0%,#f6f8fc 100%)";
const auroraGradDark = "linear-gradient(120deg,#181b23 0%,#232946 100%)";

// ---- PARTICLES CONFIG ----
const particlesOptions = (isDark) => ({
  fpsLimit: 60,
  fullScreen: { enable: false },
  style: { position: "absolute", inset: 0, zIndex: 0 },
  particles: {
    color: { value: isDark ? "#7f5af0" : "#f6c177" },
    links: { enable: false },
    move: { enable: true, speed: 0.3, direction: "none", outModes: "out" },
    number: { value: 24, density: { enable: true, area: 800 } },
    opacity: { value: 0.19, random: true },
    shape: { type: "circle" },
    size: { value: { min: 1.5, max: 3.2 }, random: true },
  },
  detectRetina: true,
});

// ---- ICONS ----
const icons = {
  All: "📅", Scheduled: "⏳", Completed: "✅", Pending: "🕒", Missed: "❗", Cancelled: "🚫"
};
const STATUS_ICONS = {
  Scheduled: "⏳", Completed: "✅", Cancelled: "🚫", Pending: "🕒", Missed: "❗"
};
const FILTERS = [
  { key: "All", icon: "📅", label: "All" },
  { key: "Scheduled", icon: "⏳", label: "Scheduled" },
  { key: "Completed", icon: "✅", label: "Completed" },
  { key: "Pending", icon: "🕒", label: "Pending" },
  { key: "Missed", icon: "❗", label: "Missed" },
  { key: "Cancelled", icon: "🚫", label: "Cancelled" },
];

// ---- DASHBOARD SUMMARY ----
function DashboardSummary({ data, isDark }) {
  function useCountUp(final) {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let start = 0;
      const step = Math.ceil(final / 24);
      const interval = setInterval(() => {
        start += step;
        setCount(start > final ? final : start);
        if (start >= final) clearInterval(interval);
      }, 18);
      return () => clearInterval(interval);
    }, [final]);
    return count;
  }
  const summary = useMemo(() => {
    const counts = { All: 0 };
    STATUS_LIST.forEach(status => counts[status] = 0);
    data.forEach(a => {
      counts.All += 1;
      if (counts[a.status] !== undefined) counts[a.status] += 1;
    });
    return counts;
  }, [data]);
  const cardGrads = isDark
    ? [
        "from-[#232946dd] to-[#7f5af0cc]",
        "from-[#181b23cc] to-[#20be6bcc]",
        "from-[#232946cc] to-[#f6c177cc]",
        "from-[#232946cc] to-[#f1515bcc]",
        "from-[#232946cc] to-[#ffad30cc]",
        "from-[#181b23cc] to-[#e0e5eccf]"
      ]
    : [
        "from-[#e0e5ecf8] to-[#7f5af0ad]",
        "from-[#e0e5ecf8] to-[#20be6bad]",
        "from-[#e0e5ecf8] to-[#f6c177ad]",
        "from-[#e0e5ecf8] to-[#f1515bad]",
        "from-[#e0e5ecf8] to-[#ffad30ad]",
        "from-[#e0e5ecf8] to-[#232946ad]"
      ];
  const keys = ["All", ...STATUS_LIST];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 z-10 relative">
      {keys.map((k, idx) => (
        <motion.div
          key={k}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08, duration: 0.5, type: "spring" }}
          tabIndex={0}
          aria-label={`${k} appointments`}
          className={`rounded-2xl px-2 py-4 sm:px-4 flex flex-col items-center shadow-xl neumorph-card
              cursor-default group relative overflow-hidden border-0
              bg-gradient-to-br ${cardGrads[idx]}
              ${isDark ? "text-white" : "text-[#232946]"}`}
          style={{
            backdropFilter: "blur(10px)",
            boxShadow: isDark
              ? "0 6px 26px 0 #191e3080, 0 1.5px 3px 0 #232946"
              : "0 6px 22px 0 #b3bdd7aa, 0 1.5px 3px 0 #e0e5ec"
          }}
        >
          <span className="text-2xl mb-1 drop-shadow-lg">{icons[k]}</span>
          <span className="font-extrabold text-xl drop-shadow">{useCountUp(summary[k])}</span>
          <span className="text-xs mt-1 opacity-80 tracking-wide">{k}</span>
          <motion.div
            className="absolute -inset-2 rounded-2xl pointer-events-none"
            initial={{ opacity: 0.13 }}
            animate={{ opacity: [0.13, 0.19, 0.13], scale: [1, 1.04, 1] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            style={{
              background: isDark
                ? "radial-gradient(ellipse at 40% 30%, #7f5af033 0%,transparent 60%)"
                : "radial-gradient(ellipse at 60% 30%, #f6c17733 0%,transparent 70%)"
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ---- STATUS BADGE ----
function StatusBadge({ status }) {
  return (
    <motion.span
      initial={{ scale: 0.92, opacity: 0.7 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.24 }}
      className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded-full text-xs font-semibold shadow-sm
        transition-all ${STATUS_STYLES[status] || STATUS_STYLES.default}
        `}
      style={{
        textShadow: "0 1.5px 4px rgba(0,0,0,0.08)",
        letterSpacing: "0.03em"
      }}
    >
      <span>{STATUS_ICONS[status] || "•"}</span>
      <span>{status}</span>
    </motion.span>
  );
}

// ---- APPOINTMENT CARD ----
function AppointmentCard({ appt, tabIndex, onKeyDown }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34 }}
      className="patients-card focus:ring-2 focus:ring-[#7f5af0] focus:outline-none neumorph-card relative"
      tabIndex={tabIndex}
      role="row"
      aria-label={`Appointment ${appt.appointment_id}`}
      onKeyDown={onKeyDown}
      style={{
        background: "rgba(255,255,255,0.19)",
        backdropFilter: "blur(15px)",
        borderRadius: "1.15rem",
        border: "1.5px solid #e0e5ec55",
        boxShadow: "0 3.5px 12px 0 #b3bdd7bb, 0 1.5px 3px 0 #e0e5ec"
      }}
    >
      <div className="flex flex-col gap-1 card-info">
        <div className="card-name font-semibold text-lg mb-1 flex items-center">
          <span className="mr-2">#{appt.appointment_id}</span>
          <StatusBadge status={appt.status} />
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="card-row"><span className="font-semibold">Patient:</span> {appt.patient_id}</div>
          <div className="card-row"><span className="font-semibold">Staff:</span> {appt.staff_id}</div>
        </div>
        <div className="card-row"><span className="font-semibold">Type:</span> {appt.appointment_type}</div>
        <div className="card-row"><span className="font-semibold">Date:</span> {appt.date}</div>
        <div className="card-row"><span className="font-semibold">Time:</span> {appt.time}</div>
      </div>
    </motion.div>
  );
}

// ---- TABLE ROW ----
function AppointmentRow({ appt, tabIndex, onKeyDown }) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="patients-row focus:ring-2 focus:ring-[#7f5af0] focus:outline-none neumorph-card"
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
        <StatusBadge status={appt.status} />
      </td>
    </motion.tr>
  );
}

// ---- SEARCH ICON ----
const SearchIcon = ({ dark }) => (
  <svg width="21" height="21" fill="none" aria-hidden="true" viewBox="0 0 24 24"
    className={`transition-colors ${dark ? "text-[#f6c177]" : "text-[#7f5af0]"}`}>
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
    <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// ---- FLOATING DARK/LIGHT TOGGLE ----
function ThemeToggle({ isDark, setIsDark }) {
  return (
    <motion.button
      className="fixed z-50 top-6 right-6 md:top-8 md:right-12 rounded-full p-3 bg-white/70 dark:bg-[#232946]/90 shadow-xl border-0 outline-none transition-all"
      style={{ boxShadow: "0 2px 12px #7f5af088" }}
      aria-label="Toggle dark mode"
      onClick={() => {
        if (typeof window !== "undefined") {
          const isCurrentlyDark =
            document.body.getAttribute("data-theme") === "dark" ||
            document.body.classList.contains("dark");
          if (isCurrentlyDark) {
            document.body.classList.remove("dark");
            document.body.setAttribute("data-theme", "light");
          } else {
            document.body.classList.add("dark");
            document.body.setAttribute("data-theme", "dark");
          }
        }
        setIsDark((prev) => !prev);
      }}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.08 }}
    >
      {isDark ? (
        <span role="img" aria-label="Light mode" className="text-2xl">🌞</span>
      ) : (
        <span role="img" aria-label="Dark mode" className="text-2xl">🌜</span>
      )}
    </motion.button>
  );
}

// ---- FLOATING ADD BUTTON ----
function FloatingAddButton({ onClick, isDark }) {
  return (
    <motion.button
      onClick={onClick}
      aria-label="Add Appointment"
      className={`fixed z-50 right-6 bottom-8 md:right-12 md:bottom-16 outline-none
        border-none rounded-full w-[64px] h-[64px] flex items-center justify-center
        neumorph-fab shadow-xl transition-all duration-200
        ${isDark
          ? "bg-[#232946] text-[#f6c177] hover:bg-[#1a1f2b]"
          : "bg-[#e0e5ec] text-[#7f5af0] hover:bg-[#f6f8fc]"
        }`}
      style={{
        boxShadow: isDark
          ? "0 6px 24px 0 #14182466, 0 1.5px 3px 0 #232946"
          : "0 6px 24px 0 #b3bdd7, 0 1.5px 3px 0 #e0e5ec",
        willChange: "transform"
      }}
      whileHover={{ scale: 1.10, boxShadow: "0 0 24px 6px #7f5af088" }}
      whileTap={{ scale: 0.96 }}
    >
      <span className="sr-only">Add appointment</span>
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
        <circle cx="19" cy="19" r="16" fill="currentColor" opacity="0.10" />
        <path d="M19 12v14M12 19h14" stroke="currentColor" strokeWidth="2.7"
          strokeLinecap="round" />
      </svg>
      <motion.span
        className="absolute"
        style={{ zIndex: 1 }}
        animate={{ opacity: [0.15, 0.36, 0.15], scale: [1, 1.14, 1] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
      >
        {/* Ripple Glow */}
      </motion.span>
    </motion.button>
  );
}

// ---- MODAL ----
// (Unchanged from your code, included for completeness)

function AddAppointmentModal({ open, onClose, onAdd, isDark }) {
  const [form, setForm] = useState({
    patient_id: "",
    staff_id: "",
    appointment_type: "",
    date: "",
    time: "",
    status: "Scheduled",
  });
  const dialogRef = useRef();

  useEffect(() => {
    if (open) {
      dialogRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleTab(e) {
      if (!dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll(
        "input,select,button,[tabindex]:not([tabindex='-1'])"
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [open, onClose]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    onAdd(form);
    onClose();
    setForm({
      patient_id: "",
      staff_id: "",
      appointment_type: "",
      date: "",
      time: "",
      status: "Scheduled",
    });
  }
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          aria-modal="true"
          role="dialog"
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            background: isDark
              ? "rgba(19, 22, 28, 0.75)"
              : "rgba(224, 229, 236, 0.53)",
            backdropFilter: "blur(9px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.form
            ref={dialogRef}
            className={`relative w-11/12 max-w-md mx-auto p-8 rounded-3xl shadow-2xl
              border-0 outline-none neumorph-modal
              ${isDark ? "bg-[#232946ee] text-[#fafafa]" : "bg-[#e0e5ecee] text-[#232946]"}`}
            style={{
              boxShadow: isDark
                ? "0 8px 36px 0 #141824bb, 0 1.5px 3px 0 #232946"
                : "0 8px 36px 0 #b3bdd7cc, 0 1.5px 3px 0 #e0e5ec",
              background: isDark ? "rgba(35,41,70,0.95)" : "rgba(224,229,236,0.95)",
              backdropFilter: "blur(20px)",
            }}
            initial={{ scale: 0.94, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 210, damping: 24, duration: 0.35 }}
            tabIndex={-1}
            onClick={e => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <h3 className="text-xl font-extrabold mb-4 flex items-center gap-2">
              <span role="img" aria-label="plus">➕</span>
              New Appointment
            </h3>
            {/* ...rest of modal form unchanged... */}
            {/*  ... */}
            <label className="block mb-4 font-semibold relative">
              <span className="absolute left-3 top-[-0.9rem] px-1 text-xs rounded bg-opacity-60"
                style={{ background: isDark ? "#232946" : "#e0e5ec", transition: "background 0.2s" }}>
                Status
              </span>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-transparent border border-[#b3bdd7] focus:border-[#7f5af0] outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.13)" }}
              >
                {STATUS_LIST.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <div className="flex mt-3 gap-4 justify-end">
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-base font-semibold bg-[#f1515b22] text-[#f1515b] hover:bg-[#f1515b33] transition"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-base font-semibold bg-[#7f5af0] text-white hover:bg-[#6356b8] transition"
              >
                Add
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---- MAIN COMPONENT ----
export default function Appointments() {
  const [query, setQuery] = useState("");
  const [focusIdx, setFocusIdx] = useState(-1);
  const [statusFilter, setStatusFilter] = useState("All");
  const inputRef = useRef();
  const [isDark, setIsDark] = useState(() =>
    typeof window !== "undefined"
      ? (document.body.getAttribute("data-theme") === "dark" || document.body.classList.contains("dark"))
      : false
  );
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState(initialAppointments);

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

  const handleAddAppointment = (newAppt) => {
    setAppointments(a => [
      ...a,
      {
        ...newAppt,
        appointment_id: a.length
          ? Math.max(...a.map(x => Number(x.appointment_id))) + 1
          : 1
      }
    ]);
  };

  const summaryCounts = useMemo(() => {
    const counts = { All: appointments.length };
    STATUS_LIST.forEach(status => counts[status] = 0);
    appointments.forEach(a => {
      if (counts[a.status] !== undefined) counts[a.status] += 1;
    });
    return counts;
  }, [appointments]);

  const filtered = useMemo(() => {
    let base = appointments;
    if (statusFilter !== "All")
      base = base.filter(a => a.status === statusFilter);
    if (!query.trim()) return base;
    const q = query.trim().toLowerCase();
    return base.filter(
      (a) =>
        String(a.appointment_id).includes(q) ||
        String(a.patient_id).toLowerCase().includes(q) ||
        String(a.staff_id).toLowerCase().includes(q) ||
        a.appointment_type.toLowerCase().includes(q) ||
        a.date.toLowerCase().includes(q) ||
        a.time.toLowerCase().includes(q) ||
        a.status.toLowerCase().includes(q)
    );
  }, [query, appointments, statusFilter]);

  return (
    <section
      className="patients-wrap relative px-1 md:px-4 py-4 sm:py-7 min-h-screen overflow-x-hidden"
      style={{
        background: isDark ? auroraGradDark : auroraGradLight,
        transition: "background 0.5s",
        borderRadius: "1.2rem",
      }}
    >
      {/* Aurora particles background */}
      <Particles
        id="tsparticles"
        options={particlesOptions(isDark)}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          borderRadius: "1.2rem"
        }}
      />

      {/* Subtle noise overlay */}
      <div
        style={{
          pointerEvents: "none",
          zIndex: 1,
          position: "absolute",
          inset: 0,
          background: "url('https://www.transparenttextures.com/patterns/noise.png') repeat",
          opacity: isDark ? 0.13 : 0.08,
          mixBlendMode: "overlay",
          borderRadius: "1.2rem",
        }}
        aria-hidden="true"
      />

      {/* Floating Theme Toggle */}
      <ThemeToggle isDark={isDark} setIsDark={setIsDark} />

      {/* Dashboard summary cards */}
      <DashboardSummary data={appointments} isDark={isDark} />

      {/* ------- FILTER BAR -------- */}
      <nav
        aria-label="Appointment Filters"
        className="w-full sticky top-0 left-0 z-20 flex items-center overflow-x-auto scrollbar-none mb-6"
        style={{
          paddingBottom: 4,
          background: "transparent",
        }}
      >
        <ul className="flex gap-2 md:gap-4 w-full px-1 sm:px-0 overflow-x-auto scrollbar-none">
          {FILTERS.map(({ key, icon, label }, idx) => {
            const active = key === statusFilter;
            return (
              <motion.li
                key={key}
                className="list-none"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.09 + idx * 0.04, duration: 0.33 }}
              >
                <button
                  type="button"
                  aria-pressed={active}
                  tabIndex={0}
                  className={`flex items-center gap-2 px-3 py-2 sm:px-4 rounded-2xl border text-base font-semibold shadow-lg transition-all
                    ${active
                      ? isDark
                        ? "bg-[#7f5af0ee] text-white border-[#7f5af0]"
                        : "bg-[#7f5af0ee] text-white border-[#7f5af0]"
                      : isDark
                        ? "bg-[#232946cc] text-[#fafafa] border-[#232946]"
                        : "bg-[#e0e5ecbb] text-[#232946] border-[#e0e5ec]"
                    }
                    hover:scale-105 active:scale-97 outline-none focus:ring-2 focus:ring-[#7f5af0] cursor-pointer
                    `}
                  style={{
                    backdropFilter: "blur(8px)",
                    borderWidth: 1.5,
                    boxShadow: active
                      ? "0 1.5px 12px 0 #7f5af044"
                      : "0 1.5px 8px 0 #b3bdd744",
                    minWidth: 96,
                  }}
                  onClick={() => setStatusFilter(key)}
                  onKeyDown={e => {
                    if (["Enter", " "].includes(e.key)) setStatusFilter(key);
                  }}
                >
                  <span className="text-lg">{icon}</span>
                  <span className="hidden sm:inline">{label}</span>
                  <span
                    className={`ml-1 min-w-[1.2em] rounded-lg px-2 py-0.5 text-xs font-bold
                      ${active
                        ? "bg-white/20 text-white"
                        : "bg-black/10 text-inherit"
                      }`}
                  >
                    {summaryCounts[key] ?? 0}
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Header + Search */}
      <header className="patients-header mb-6 flex flex-col md:flex-row gap-2 md:items-center md:justify-between z-10 relative">
        <h2 className="font-extrabold text-2xl flex items-center drop-shadow">
          <span role="img" aria-label="calendar" className="mr-2">📅</span>
          Appointments
        </h2>
        <form
          className="search-bar relative flex items-center gap-2 rounded-2xl px-3 py-2 shadow bg-white/80 dark:bg-[#1a1f2b]/80 transition-colors"
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
            className="transition-colors bg-transparent outline-none ml-2 text-base"
            style={{ minWidth: 110 }}
          />
        </form>
      </header>

      {/* Table (Desktop) */}
      <div className="patients-table-outer hidden md:block relative z-10">
        <table
          className="patients-table rounded-2xl overflow-hidden"
          role="table"
          aria-label="Appointments"
          style={{
            background: isDark ? "rgba(35,41,70,0.87)" : "rgba(255,255,255,0.93)",
            backdropFilter: "blur(5px)",
            borderRadius: "1.1rem",
            boxShadow: isDark
              ? "0 2.5px 13px 0 #181b23aa, 0 1.5px 3px 0 #232946"
              : "0 2.5px 13px 0 #e0e5ec88, 0 1.5px 3px 0 #b3bdd7"
          }}
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
            <AnimatePresence>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty text-center py-6 text-lg opacity-60" aria-live="polite">
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
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Cards (Mobile) */}
      <div className="patients-cards block md:hidden z-10">
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="empty text-center py-6 text-lg opacity-60" aria-live="polite">
              <span role="img" aria-label="empty">🕳️</span> No appointments found.
            </motion.div>
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
        </AnimatePresence>
      </div>

      {/* Floating Add Button */}
      <FloatingAddButton
        onClick={() => setShowModal(true)}
        isDark={isDark}
      />

      {/* Add Appointment Modal */}
      <AddAppointmentModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddAppointment}
        isDark={isDark}
      />
    </section>
  );
}