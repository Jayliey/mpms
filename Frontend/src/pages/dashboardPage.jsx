import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import classNames from "classnames";

const API_URL = "http://localhost:3001/patient/";
const MEDICATION_API = "http://localhost:3001/medication/patient/";

// -- Custom Hook for Theme
function useDarkMode() {
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  return [darkMode, setDarkMode];
}

// -- Loader Component
function Loader() {
  return (
    <div className="flex justify-center items-center min-h-[160px]">
      <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin shadow-neumorph-in dark:border-blue-300"></div>
    </div>
  );
}

// -- Glass/Neumorph Modal Wrapper
function Modal({ open, onClose, children, ariaLabel }) {
  const modalRef = useRef();

  // Focus trap
  useEffect(() => {
    if (!open) return;
    const focusable = modalRef.current.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    if (focusable.length) focusable[0].focus();
    const handleTab = (e) => {
      if (e.key !== "Tab") return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose, open]);

  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
        aria-modal="true"
        role="dialog"
        aria-label={ariaLabel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        tabIndex={-1}
        onClick={onClose}
      >
        <motion.div
          className="relative bg-white dark:bg-gray-900/80 rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] w-[97vw] max-w-2xl p-6 neumorph-glass"
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={e => e.stopPropagation()}
          ref={modalRef}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// -- Darkmode Toggle Button
function DarkModeToggle({ darkMode, setDarkMode }) {
  return (
    <button
      className="fixed top-5 right-7 z-[100] rounded-full shadow-lg bg-white/80 dark:bg-gray-900/80 p-2 transition hover:scale-110 focus:outline-none"
      aria-label="Toggle dark mode"
      onClick={() => setDarkMode((d) => !d)}
    >
      <span className="sr-only">Toggle dark mode</span>
      {darkMode ? (
        <svg className="w-7 h-7 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m8.485-8.485h1m-16.97 0h1m12.728-7.071l.707.707M4.222 19.778l.707.707m12.728 0l-.707.707M4.222 4.222l.707.707M12 5a7 7 0 1 1 0 14 7 7 0 0 1 0-14z" /></svg>
      ) : (
        <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79z" /></svg>
      )}
    </button>
  );
}

// -- Status Chip
function StatusChip({ status }) {
  const map = {
    "active": "bg-green-500 text-white",
    "pending": "bg-yellow-400 text-gray-900",
    "inactive": "bg-gray-400 text-white",
    "completed": "bg-blue-600 text-white",
    "admitted": "bg-purple-500 text-white",
    "default": "bg-gray-200 text-gray-700"
  };
  return (
    <span className={classNames(
      "px-2 py-0.5 rounded text-xs font-bold shadow-sm inline-block",
      map[status?.toLowerCase()] || map.default
    )}>
      {status}
    </span>
  );
}

// -- Patient Card
function PatientCard({ patient, onView, onMedications }) {
  return (
    <motion.div
      className="rounded-xl p-5 shadow-neumorph bg-white/80 dark:bg-gray-900/70 backdrop-blur hover:shadow-neumorph-in transition-all relative flex flex-col gap-3 neumorph-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.025 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      tabIndex={0}
      aria-label={`Patient card for ${patient.name} ${patient.surname}`}
    >
      <div className="flex items-center gap-3">
        <img
          src={`https://picsum.photos/seed/${patient.patient_id}/72/72`}
          alt={`${patient.name} ${patient.surname} avatar`}
          className="rounded-full w-16 h-16 shadow-md object-cover border-4 border-white dark:border-gray-800 bg-gray-200"
          loading="lazy"
        />
        <div>
          <div className="font-bold text-lg text-gray-900 dark:text-gray-100">
            {patient.name} {patient.surname}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400 text-sm">Age: {patient.age}</span>
            <StatusChip status={patient.status} />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{patient.gender || "-"}</div>
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          className="bg-gradient-to-r from-blue-600 to-sky-400 text-white px-3 py-1 rounded-lg shadow-sm transition hover:from-blue-700 hover:to-sky-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => onView(patient)}
        >
          View Details
        </button>
        <button
          className="bg-gradient-to-r from-purple-600 to-fuchsia-400 text-white px-3 py-1 rounded-lg shadow-sm transition hover:from-purple-700 hover:to-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
          onClick={() => onMedications(patient.patient_id)}
        >
          Medication History
        </button>
      </div>
    </motion.div>
  );
}

// -- Medication Card
function MedicationCard({ med, onSell }) {
  return (
    <motion.div
      className="rounded-xl p-4 bg-white/70 dark:bg-gray-900/60 shadow-neumorph mb-2"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.09 }}
    >
      <div className="font-bold text-blue-700 dark:text-blue-300 text-lg mb-1">{med.description}</div>
      <div className="text-xs text-gray-700 dark:text-gray-300 italic mb-2">Prescribed by: {med.assigned_by}</div>
      <div className="text-sm text-gray-800 dark:text-gray-200">Instructions: {med.consumption_description}</div>
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Start: <span className="font-medium">{new Date(med.start_date).toLocaleDateString()}</span>
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300">
        End: <span className="font-medium">{new Date(med.end_date).toLocaleDateString()}</span>
      </div>
      <div className="text-sm mt-1">
        Status: <StatusChip status={med.consumption_status} />
      </div>
      {med.consumption_status?.toLowerCase() === "pending" && (
        <button
          className="mt-3 bg-gradient-to-r from-green-600 to-emerald-400 text-white px-4 py-1 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={onSell}
        >
          Sell
        </button>
      )}
    </motion.div>
  );
}

// -- Floating Add Patient Button (FAB, for future extensibility)
function AddPatientFAB() {
  return (
    <button
      className="fixed bottom-10 right-10 z-40 bg-gradient-to-r from-emerald-600 to-blue-400 text-white rounded-full shadow-xl p-4 flex items-center justify-center text-3xl hover:scale-105 active:scale-95 focus:outline-none border-4 border-white dark:border-gray-800"
      title="Add Patient (Coming Soon)"
      aria-label="Add Patient"
      disabled
    >
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
}

// -- Main Page
export default function SearchPatientsPage() {
  const [darkMode, setDarkMode] = useDarkMode();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editPatient, setEditPatient] = useState(null);
  const [medications, setMedications] = useState([]);
  const [showMedicationsModal, setShowMedicationsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [medLoading, setMedLoading] = useState(false);

  // --- Fetch Patients
  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setPatients(response.data);
      setFilteredPatients(response.data);
    } catch {
      Swal.fire("Error", "Failed to fetch patients", "error");
    }
    setLoading(false);
  };

  // --- Search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(value) ||
        patient.surname.toLowerCase().includes(value)
    );
    setFilteredPatients(filtered);
  };

  // --- Edit
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const updatedData = { ...editPatient };
      delete updatedData.patient_id;
      delete updatedData.status;
      delete updatedData.time_signed;
      await axios.put(`${API_URL}${editPatient.patient_id}`, updatedData);
      Swal.fire("Updated", "Patient information updated successfully", "success");
      fetchPatients();
      setEditPatient(null);
      setSelectedPatient(null);
    } catch {
      Swal.fire("Error", "Failed to update patient info", "error");
    }
  };

  // --- Delete
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This patient record will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}${selectedPatient.patient_id}`);
        Swal.fire("Deleted!", "Patient record has been deleted.", "success");
        fetchPatients();
        setSelectedPatient(null);
      } catch {
        Swal.fire("Error", "Failed to delete patient", "error");
      }
    }
  };

  // --- Medications
  const fetchMedications = async (patientId) => {
    setMedLoading(true);
    try {
      const response = await axios.get(`${MEDICATION_API}${patientId}`);
      setMedications(response.data);
      setShowMedicationsModal(true);
    } catch {
      Swal.fire("Error", "Failed to fetch medication history", "error");
    }
    setMedLoading(false);
  };

  const handleSellClick = () => {
    Swal.fire("Action", "Sell button clicked!", "info");
  };

  // --- Background Animated Gradient + Parallax Texture
  useEffect(() => {
    // Tiny noise overlay using SVG
    if (!document.getElementById("parallax-noise")) {
      const svg = document.createElement("div");
      svg.id = "parallax-noise";
      svg.style.cssText = "pointer-events:none;position:fixed;inset:0;z-index:0;opacity:.06;mix-blend-mode:soft-light;";
      svg.innerHTML = `<svg width="100%" height="100%" style="position:absolute;inset:0" xmlns="http://www.w3.org/2000/svg"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#noise)"/></svg>`;
      document.body.appendChild(svg);
    }
    return () => {
      const el = document.getElementById("parallax-noise");
      if (el) el.remove();
    };
  }, []);

  // --- Main Render
  return (
    <div className={classNames(
      "min-h-screen relative transition-colors pb-20",
      "bg-gradient-to-tr from-blue-100 via-emerald-100 to-fuchsia-100 dark:from-gray-900 dark:via-blue-900 dark:to-gray-800"
    )}>
      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      <AddPatientFAB />

      {/* Animated Gradient BG */}
      <motion.div
        aria-hidden
        className="fixed inset-0 z-0"
        style={{ pointerEvents: "none" }}
        initial={{ opacity: 0.92 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="absolute w-[120vw] h-[120vh] left-[-10vw] top-[-10vh] bg-gradient-conic from-sky-300 via-blue-300 to-fuchsia-200 dark:from-blue-900 dark:via-emerald-900 dark:to-blue-700 blur-2xl opacity-50"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.04, 1],
            x: [0, 10, 0],
            y: [0, -10, 0]
          }}
          transition={{ repeat: Infinity, duration: 34, ease: "linear" }}
        ></motion.div>
      </motion.div>

      {/* HEADER */}
      <div className="z-10 relative">
        <header className="pt-12 pb-6 flex flex-col items-center">
          <motion.h1
            className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-700 via-emerald-600 to-fuchsia-500 dark:from-sky-200 dark:via-emerald-100 dark:to-fuchsia-300 text-transparent bg-clip-text mb-1 drop-shadow-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Maternity Patient Search
          </motion.h1>
          <p className="text-sm md:text-lg text-gray-700 dark:text-gray-300 max-w-xl text-center mt-2">
            Easily search, view, and manage patients with a beautiful, responsive and animated UI.
          </p>
        </header>

        {/* SEARCH BOX */}
        <div className="flex justify-center mx-auto max-w-2xl">
          <input
            type="text"
            placeholder="Search by name or surname"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-800/60 shadow-neumorph focus:outline-none focus:ring-2 focus:ring-blue-300 text-base font-medium transition"
            style={{ minWidth: 0 }}
            aria-label="Search patients"
          />
        </div>
      </div>

      {/* PATIENT GRID */}
      <section className="relative z-10 pt-10 pb-7 max-w-7xl mx-auto px-4">
        {loading ? (
          <Loader />
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07 } }
            }}
          >
            {filteredPatients.length === 0 && (
              <motion.div className="text-center text-gray-500 dark:text-gray-300 text-xl col-span-full">
                No patients found.
              </motion.div>
            )}
            {filteredPatients.map((patient) => (
              <PatientCard
                key={patient.patient_id}
                patient={patient}
                onView={setSelectedPatient}
                onMedications={fetchMedications}
              />
            ))}
          </motion.div>
        )}
      </section>

      {/* MEDICATIONS MODAL */}
      <Modal open={showMedicationsModal} onClose={() => setShowMedicationsModal(false)} ariaLabel="Medication History">
        <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-fuchsia-400 text-transparent bg-clip-text">
          Medication History
        </h2>
        {medLoading ? <Loader /> : medications.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-200 my-6">No medical records found for this patient.</p>
        ) : (
          <div className="space-y-3 max-h-[58vh] overflow-y-auto pr-2">
            <AnimatePresence>
              {medications.map((med, index) => (
                <MedicationCard key={index} med={med} onSell={handleSellClick} />
              ))}
            </AnimatePresence>
          </div>
        )}
        <div className="flex justify-end mt-8">
          <button
            className="bg-gradient-to-r from-gray-500 to-gray-400 text-white px-6 py-2 rounded-xl shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={() => setShowMedicationsModal(false)}
          >
            Close
          </button>
        </div>
      </Modal>

      {/* PATIENT DETAILS MODAL */}
      <Modal open={!!selectedPatient && !editPatient} onClose={() => setSelectedPatient(null)} ariaLabel="Patient Details">
        {selectedPatient && (
          <div>
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              Patient Details
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <img
                src={`https://picsum.photos/seed/${selectedPatient.patient_id}/88/88`}
                alt={`${selectedPatient.name} ${selectedPatient.surname} avatar`}
                className="rounded-xl w-20 h-20 shadow-lg border-4 border-white dark:border-gray-800 bg-gray-200 mb-2"
                loading="lazy"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-gray-800 dark:text-gray-200">
                {Object.entries(selectedPatient)
                  .filter(([key, value]) =>
                    value !== null &&
                    value !== "" &&
                    key !== "patient_id" &&
                    key !== "time_signed"
                  )
                  .map(([key, value]) => (
                    <div key={key}>
                      <span className="font-semibold capitalize text-sm">{key.replace(/_/g, " ")}:</span>
                      <span className="ml-2 text-base">{value}</span>
                    </div>
                  ))}
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button
                className="bg-gradient-to-r from-blue-600 to-sky-400 text-white px-6 py-2 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={() => setEditPatient(selectedPatient)}
              >
                Update Details
              </button>
              <button
                className="bg-gradient-to-r from-red-600 to-rose-400 text-white px-6 py-2 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-red-400"
                onClick={handleDelete}
              >
                Delete Patient
              </button>
              <button
                className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 py-2 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={() => setSelectedPatient(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* EDIT PATIENT MODAL */}
      <Modal open={!!editPatient} onClose={() => setEditPatient(null)} ariaLabel="Edit Patient Info">
        {editPatient && (
          <>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-sky-400 text-transparent bg-clip-text">
              Edit Patient Info
            </h2>
            <form
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              onSubmit={e => { e.preventDefault(); handleUpdate(); }}
            >
              {Object.entries(editPatient)
                .filter(
                  ([key]) =>
                    key !== "patient_id" &&
                    key !== "time_signed" &&
                    key !== "status" &&
                    key !== "gender"
                )
                .map(([key, value]) => (
                  <div key={key}>
                    {key === "marital_status" ? (
                      <>
                        <label className="block text-sm font-semibold mb-1">
                          Marital Status
                        </label>
                        <select
                          name="marital_status"
                          value={editPatient.marital_status || ""}
                          onChange={handleEditChange}
                          className="border p-2 rounded-lg w-full bg-white/70 dark:bg-gray-800/60 shadow"
                        >
                          <option value="">Select</option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                        </select>
                      </>
                    ) : (key.includes("spouse") && editPatient.marital_status !== "Married") ? null : (
                      <>
                        <label className="block text-sm font-semibold mb-1">
                          {key.replace(/_/g, " ")}
                        </label>
                        <input
                          name={key}
                          value={value || ""}
                          onChange={handleEditChange}
                          className="border p-2 rounded-lg w-full bg-white/70 dark:bg-gray-800/60 shadow"
                          autoComplete="off"
                        />
                      </>
                    )}
                  </div>
                ))}
              <div className="col-span-full flex justify-end mt-4 gap-2">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-emerald-400 text-white px-6 py-2 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="bg-gradient-to-r from-red-600 to-rose-400 text-white px-6 py-2 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-red-400"
                  onClick={() => setEditPatient(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </Modal>
      {/* Footer */}
      <footer className="mt-14 text-center text-xs text-gray-500 dark:text-gray-400 z-20 relative">
        <span>
        &copy; {new Date().getFullYear()} Maternity Patient System. All rights reserved. | UI by <span className="font-semibold text-blue-500">WebDeveloper_FSD</span>
        </span>
      </footer>
      {/* Custom CSS for neumorphism & glass */}
      <style>{`
      .shadow-neumorph {
        box-shadow:
          8px 8px 24px 0 rgba(30, 60, 120, 0.07),
          -8px -8px 24px 0 rgba(255,255,255,0.7),
          0 1.5px 5px 0 rgba(0,0,0,0.02);
      }
      .shadow-neumorph-in {
        box-shadow:
          inset 4px 4px 18px 0 rgba(30,60,120,0.12),
          inset -4px -4px 16px 0 rgba(255,255,255,0.5);
      }
      .neumorph-card {
        background: linear-gradient(120deg,rgba(255,255,255,0.75) 70%,rgba(235,244,255,0.42) 100%);
        backdrop-filter: blur(0.5px);
      }
      .neumorph-glass {
        background: linear-gradient(140deg,rgba(255,255,255,0.92) 70%,rgba(235,244,255,0.48) 100%);
        backdrop-filter: blur(8px) saturate(1.2);
      }
      .dark .neumorph-card {
        background: linear-gradient(120deg,rgba(28,32,42,0.88) 70%,rgba(36,54,94,0.38) 100%);
      }
      .dark .neumorph-glass {
        background: linear-gradient(130deg,rgba(23,28,33,0.97) 60%,rgba(32,44,72,0.48) 100%);
      }
      `}</style>
    </div>
  );
}