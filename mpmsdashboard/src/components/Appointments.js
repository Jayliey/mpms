import React, { useState, useMemo, useRef, useEffect } from "react";
import { appointments as initialAppointments } from "../services/data";
import { motion, AnimatePresence } from "framer-motion";
import styles from '../styles/appointments.module.css'
import { URL } from "../services/endpoints";

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

// ---- ICONS ----
const STATUS_ICON  = {
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
          <span className="ml-2 text-2xl">{STATUS_ICON[appt.status]}</span> {/* Add icon here */}
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="card-row">
            <span className="font-semibold">Patient:</span> {appt.patient_id}
          </div>
          <div className="card-row">
            <span className="font-semibold">Staff:</span> {appt.staff_id}
          </div>
          <div className="card-row">
            <span className="font-semibold">Category:</span> {appt.appointment_category}
          </div>
          <div className="card-row">
            <span className="font-semibold">State:</span> {appt.appointment_state}
          </div>
        </div>
        <div className="card-row">
          <span className="font-semibold">Type:</span> {appt.appointment_type}
        </div>
        <div className="card-row">
          <span className="font-semibold">Date:</span> {new Date(appt.date).toLocaleDateString()}
        </div>
        <div className="card-row">
          <span className="font-semibold">Time:</span> {new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="card-row">
          <span className="font-semibold">Description:</span> {appt.description}
        </div>
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
      <td>{new Date(appt.date).toLocaleDateString()}</td>
      <td>{new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
      <td>
        <StatusBadge status={appt.status} />
      </td>
      <td>{appt.appointment_category}</td>
      <td>{appt.appointment_state}</td>
      <td>{appt.description}</td>
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
function AddAppointmentModal({ open, onClose, onAdd, isDark }) {
    const [form, setForm] = useState({
        patient_id: "",
        staff_id: "",
        appointment_type: "",
        date: "",
        time: "",
        status: "Scheduled",
    });
    const [errors, setErrors] = useState({});
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

    const validateForm = () => {
        const newErrors = {};
        if (!form.patient_id) newErrors.patient_id = "Patient ID is required.";
        if (!form.staff_id) newErrors.staff_id = "Staff ID is required.";
        if (!form.appointment_type) newErrors.appointment_type = "Appointment Type is required.";
        if (!form.date) newErrors.date = "Date is required.";
        if (!form.time) newErrors.time = "Time is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
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
            setErrors({});
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    aria-modal="true"
                    role="dialog"
                    className={`${styles.modalOverlay} fixed inset-0 z-[100] flex items-center justify-center`}
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div aria-hidden="true" className={styles.modalOrb} />
                    <motion.form
                        ref={dialogRef}
                        className={`${styles.modalGlass} ${isDark ? styles.dark : styles.light} relative w-11/12 max-w-md mx-auto p-8 rounded-3xl shadow-2xl border-0 outline-none`}
                        tabIndex={-1}
                        onClick={(e) => e.stopPropagation()}
                        onSubmit={handleSubmit}
                        initial={{ scale: 0.92, opacity: 0, y: 60 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.93, opacity: 0, y: 50 }}
                        transition={{ type: "spring", stiffness: 210, damping: 24, duration: 0.35 }}
                    >
                        <div aria-hidden="true" className={styles.noiseOverlay} />
                        <button
                            type="button"
                            aria-label="Close"
                            className={styles.closeBtn}
                            onClick={onClose}
                            tabIndex={0}
                        >
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                                <circle cx="11" cy="11" r="10" fill="none" />
                                <path d="M15 7L7 15M7 7l8 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                            </svg>
                        </button>

                        <h3 className={styles.modalTitle}>
                            <span role="img" aria-label="plus">➕</span> New Appointment
                        </h3>

                        {["patient_id", "staff_id", "appointment_type"].map((field, index) => (
                            <label key={index} className={styles.formLabel}>
                                <span>{field.replace("_", " ").toUpperCase()}</span>
                                <input
                                    name={field}
                                    type="text"
                                    required
                                    value={form[field]}
                                    onChange={handleChange}
                                    className={`${styles.formInput} ${errors[field] ? 'border-red-500' : ''}`}
                                    placeholder={`Enter ${field.replace("_", " ")}`}
                                />
                                {errors[field] && <span className="text-red-500 text-sm">{errors[field]}</span>}
                            </label>
                        ))}

                        <div className={styles.row}>
                            <label className={styles.formLabel}>
                                <span>Date</span>
                                <input
                                    name="date"
                                    type="date"
                                    required
                                    value={form.date}
                                    onChange={handleChange}
                                    className={`${styles.formInput} ${errors.date ? 'border-red-500' : ''}`}
                                />
                                {errors.date && <span className="text-red-500 text-sm">{errors.date}</span>}
                            </label>
                            <label className={styles.formLabel}>
                                <span>Time</span>
                                <input
                                    name="time"
                                    type="time"
                                    required
                                    value={form.time}
                                    onChange={handleChange}
                                    className={`${styles.formInput} ${errors.time ? 'border-red-500' : ''}`}
                                />
                                {errors.time && <span className="text-red-500 text-sm">{errors.time}</span>}
                            </label>
                        </div>

                        <label className={styles.formLabel}>
                            <span>Status</span>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className={styles.formInput}
                            >
                                {STATUS_LIST.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </label>

                        <div className={styles.actions}>
                            <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={styles.submitBtn}
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


  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${URL}/appointment/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setAppointments(result); // Set the fetched data to state
      console.log("Fetched appointments:", result);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Listen for theme changes
  useEffect(() => {
    fetchAppointments();
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

  // Add appointment
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


    // --- FILTER COUNTS ---

    const summaryCounts = useMemo(() => {
    const counts = { All: appointments.length };
    STATUS_LIST.forEach(status => counts[status] = 0);
    appointments.forEach(a => {
      if (counts[a.status] !== undefined) counts[a.status] += 1;
    });
    return counts;
  }, [appointments]);

  // --- FILTERED APPOINTMENTS ---
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
  // ---- PARTICLES INIT ----


return (
  <section
    className="patients-wrap relative px-1 md:px-4 py-4 sm:py-7 min-h-screen overflow-x-hidden"
    style={{
      background: isDark ? auroraGradDark : auroraGradLight,
      transition: "background 0.5s",
      borderRadius: "1.2rem",
      position: "relative",
      zIndex: 0,
    }}
  >
    {/* --- Animated Aurora Orbs (Background) --- */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden"
      style={{ zIndex: 0, borderRadius: "1.2rem" }}
    >
      {/* Animated Orbs */}
      <div className="absolute left-1/3 top-1/5 w-80 h-80 bg-gradient-to-br from-purple-300/70 to-indigo-400/60 blur-3xl animate-float-slow rounded-full opacity-40 dark:from-purple-900/50 dark:to-indigo-900/40" />
      <div className="absolute right-20 bottom-10 w-72 h-72 bg-gradient-to-tr from-pink-200/60 to-blue-300/40 blur-2xl animate-float-reverse rounded-full opacity-30 dark:from-pink-700/40 dark:to-blue-800/30" />
      <div className="absolute left-7 bottom-24 w-40 h-40 bg-gradient-to-br from-green-200/50 to-teal-300/40 blur-2xl animate-float rounded-full opacity-30 dark:from-green-900/40 dark:to-teal-900/30" />
    </div>
    {/* --- Subtle Noise Overlay --- */}
    <div
      style={{
        pointerEvents: "none",
        zIndex: 2,
        position: "absolute",
        inset: 0,
        background: "url('https://www.transparenttextures.com/patterns/noise.png') repeat",
        opacity: isDark ? 0.13 : 0.08,
        mixBlendMode: "overlay",
        borderRadius: "1.2rem",
      }}
      aria-hidden="true"
    />

    {/* --- FILTER BAR --- */}
<nav
  aria-label="Appointment Filters"
  className="w-full sticky top-0 left-0 z-30 flex items-center overflow-x-auto scrollbar-none mb-6 backdrop-blur-md"
  style={{
    paddingBottom: 4,
    background: isDark ? "rgba(35,41,70,0.61)" : "rgba(255,255,255,0.67)",
    borderRadius: "1.1rem",
    boxShadow: isDark
      ? "0 2px 10px 0 #23294655"
      : "0 2px 10px 0 #e0e5ec44",
    border: `1.5px solid ${isDark ? "#23294677" : "#e0e5ecaa"}`,
    transition: "background 0.5s, box-shadow 0.3s",
  }}
>
  <ul className="flex gap-2 md:gap-4 w-full px-1 sm:px-0 overflow-x-auto scrollbar-none flex-row">
    {FILTERS.map(({ key, icon, label }, idx) => {
      const active = key === statusFilter;
      return (
        <motion.li
          key={key}
          className="list-none"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.09 + idx * 0.04, duration: 0.33, type: "spring", stiffness: 220 }}
        >
          <button
            type="button"
            aria-pressed={active}
            tabIndex={0}
            className={`flex items-center gap-2 px-3 py-2 sm:px-4 rounded-2xl border text-base font-semibold shadow-lg transition-all duration-200
              ${active
                ? "bg-gradient-to-tr from-[#7f5af0ee] to-[#4d2ccfcc] text-white border-[#7f5af0] shadow-purple-400/40"
                : isDark
                  ? "bg-[#232946cc] text-[#fafafa] border-[#232946] shadow-[#181b23]/30"
                  : "bg-[#e0e5ecbb] text-[#232946] border-[#e0e5ec] shadow-[#b3bdd7]/30"
              }
              hover:scale-105 active:scale-97 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7f5af0] cursor-pointer
            `}
            style={{
              backdropFilter: "blur(8px)",
              borderWidth: 1.5,
              boxShadow: active
                ? "0 1.5px 12px 0 #7f5af044"
                : "0 1.5px 8px 0 #b3bdd744",
              minWidth: 96,
              flexDirection: "row",
            }}
            onClick={() => setStatusFilter(key)}
            onKeyDown={e => {
              if (["Enter", " "].includes(e.key)) setStatusFilter(key);
            }}
          >
            <span
              className="text-lg transition-colors"
              style={{
                color: active ? "#fff" : isDark ? "#7f5af0" : "#6457a6",
                filter: active ? "drop-shadow(0 2px 4px #7f5af044)" : "none"
              }}
            >{icon}</span>
            <span className="hidden sm:inline">{label}</span>
            <span
              className={`ml-1 min-w-[1.2em] rounded-lg px-2 py-0.5 text-xs font-bold
                ${active
                  ? "bg-white/20 text-white"
                  : "bg-black/10 text-inherit"
                }
                transition-colors`}
              style={{
                boxShadow: active ? "0 1px 8px #fff2" : "none",
              }}
            >
              {summaryCounts[key] ?? 0}
            </span>
          </button>
        </motion.li>
      );
    })}
  </ul>
</nav>

    {/* --- Header + Search --- */}
    <header className="patients-header mb-6 flex flex-col md:flex-row gap-2 md:items-center md:justify-between z-20 relative">
      <h2 className="font-extrabold text-2xl flex items-center drop-shadow">
        <span
          role="img"
          aria-label="calendar"
          className="mr-2"
          style={{
            filter: isDark
              ? "drop-shadow(0 1px 6px #7f5af0aa)"
              : "drop-shadow(0 1px 6px #b3bdd788)"
          }}
        >📅</span>
        <span className="bg-gradient-to-tr from-[#7f5af0] to-[#6457a6] bg-clip-text text-transparent">
          Appointments
        </span>
      </h2>
      <form
        className="search-bar relative flex items-center gap-2 rounded-2xl px-3 py-2 shadow-lg transition-colors focus-within:ring-2 focus-within:ring-[#7f5af0] bg-white/80 dark:bg-[#1a1f2b]/80"
        role="search"
        aria-label="Search Appointments"
        onSubmit={e => e.preventDefault()}
        style={{
          border: `1.5px solid ${isDark ? "#23294688" : "#e0e5ecbb"}`,
          boxShadow: isDark
            ? "0 1.5px 8px #1a1f2b55"
            : "0 1.5px 8px #e0e5ec77",
          backdropFilter: "blur(6px)",
        }}
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
          className="transition-colors bg-transparent outline-none ml-2 text-base placeholder:text-gray-400 dark:placeholder:text-gray-400/70 font-medium"
          style={{
            minWidth: 110,
            color: isDark ? "#fafafa" : "#232946",
          }}
        />
      </form>
    </header>

    {/* --- Table (Desktop) --- */}
    <div className="patients-table-outer hidden md:block relative z-10">
        <table
          className="patients-table rounded-2xl overflow-hidden"
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
            <AnimatePresence>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty text-center py-6 text-lg opacity-60">
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

      {/* --- Cards (Mobile) --- */}
      <div className="patients-cards block md:hidden z-10">
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="empty text-center py-6 text-lg opacity-60"
            >
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


    {/* --- Cards (Mobile) --- */}
    <div className="patients-cards block md:hidden z-10">
      <AnimatePresence>
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="empty text-center py-6 text-lg opacity-60"
          >
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

    {/* --- Floating Add Button --- */}
    <FloatingAddButton
      onClick={() => setShowModal(true)}
      isDark={isDark}
    />

    {/* --- Add Appointment Modal --- */}
    <AddAppointmentModal
      open={showModal}
      onClose={() => setShowModal(false)}
      onAdd={handleAddAppointment}
      isDark={isDark}
    />

    {/* --- Accessibility & Visual Focus Aids --- */}
    {/* <span className="sr-only" aria-live="polite">
      {filtered.length === 0
        ? "No appointments found."
        : `${filtered.length} appointments shown.`}
    </span> */}
  </section>
);

}
