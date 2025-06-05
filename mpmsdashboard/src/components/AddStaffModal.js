import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Gradient backgrounds
const bgLight =
    "linear-gradient(135deg, rgba(247,247,250,0.95) 0%, rgba(255,255,255,0.85) 100%)";
const bgDark =
    "linear-gradient(135deg, rgba(32,33,36,0.98) 0%, rgba(23,24,28,0.93) 100%)";
const glass =
    "backdrop-blur-xl bg-white/60 dark:bg-neutral-900/70 shadow-2xl ring-1 ring-neutral-200/50 dark:ring-neutral-800/80";

function AnimatedBG() {
    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="a" x1="0" x2="1" y1="0" y2="1">
                    <stop stopColor="#6EE7B7" stopOpacity="0.15" />
                    <stop offset="1" stopColor="#3B82F6" stopOpacity="0.12" />
                </linearGradient>
                <radialGradient id="b">
                    <stop stopColor="#818CF8" stopOpacity="0.10" />
                    <stop offset="1" stopColor="transparent" />
                </radialGradient>
            </defs>
            <motion.ellipse
                cx="20%"
                cy="30%"
                rx="120"
                ry="80"
                fill="url(#a)"
                initial={{ opacity: 0, scale: 0.8, x: -60 }}
                animate={{ opacity: 1, scale: 1.2, x: 0 }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 0.5,
                }}
            />
            <motion.ellipse
                cx="80%"
                cy="70%"
                rx="90"
                ry="60"
                fill="url(#b)"
                initial={{ opacity: 0, scale: 1.2, x: 60 }}
                animate={{ opacity: 0.55, scale: 1, x: 0 }}
                transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 1.1,
                }}
            />
        </svg>
    );
}

export default function AddStaffModal({
    modalOpen,
    setModalOpen,
    handleAddStaff,
}) {
    const [darkMode, setDarkMode] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        if (modalOpen && modalRef.current) {
            const firstInput = modalRef.current.querySelector(
                "input, select, button"
            );
            firstInput?.focus();

            const handleTab = (e) => {
                const focusable = modalRef.current.querySelectorAll(
                    "input, select, button, textarea, [tabindex]:not([tabindex='-1'])"
                );
                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.key === "Tab") {
                    if (e.shiftKey && document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    } else if (!e.shiftKey && document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }

                if (e.key === "Escape") {
                    setModalOpen(false);
                }
            };

            modalRef.current.addEventListener("keydown", handleTab);
            return () =>
                modalRef.current?.removeEventListener("keydown", handleTab);
        }
    }, [modalOpen, setModalOpen]);

    const floatLabel =
        "relative mb-4 group focus-within:text-blue-600 dark:focus-within:text-teal-400";
    const inputBase =
        "peer w-full px-4 py-2.5 bg-transparent rounded-lg border border-neutral-300 dark:border-neutral-700 outline-none text-base transition-all placeholder-transparent focus:border-blue-500 focus:shadow-lg dark:focus:border-teal-400 dark:text-neutral-100";
    const labelBase =
        "absolute left-4 top-2.5 text-neutral-400 dark:text-neutral-500 text-sm pointer-events-none transition-all duration-200 ease-in-out peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-500 dark:peer-placeholder-shown:text-neutral-600 peer-focus:top-0 peer-focus:left-3 peer-focus:text-xs peer-focus:text-blue-500 dark:peer-focus:text-teal-400 bg-inherit px-1";

    return (
        <AnimatePresence>
            {modalOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 dark:bg-black/60 transition-all duration-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    aria-modal="true"
                    role="dialog"
                    tabIndex={-1}
                >
                    <AnimatedBG />

                    <motion.div
                        ref={modalRef}
                        className={`relative max-w-xl w-[96vw] mx-4 sm:mx-0 rounded-3xl shadow-2xl p-8 ${glass} border border-neutral-100 dark:border-neutral-800 backdrop-blur-lg ring-2 ring-blue-100/30 dark:ring-teal-900/30`}
                        style={{
                            background: darkMode ? bgDark : bgLight,
                            boxShadow: darkMode
                                ? "0 10px 40px 0 rgba(20,20,28,0.24), 0 1.5px 8px 0 rgba(0,0,0,0.10)"
                                : "0 10px 40px 0 rgba(120,130,140,0.19), 0 2px 12px 0 rgba(0,0,0,0.07)",
                        }}
                        initial={{ scale: 0.97, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.98, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        role="document"
                    >
                        <button
                            type="button"
                            onClick={() => setDarkMode((d) => !d)}
                            aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
                            className="absolute top-4 right-4 p-2 rounded-xl shadow-sm bg-white/60 dark:bg-neutral-800/60 hover:bg-white/90 dark:hover:bg-neutral-700/80 transition"
                            tabIndex={0}
                        >
                            {darkMode ? (
                                <svg
                                    className="w-6 h-6 text-yellow-400"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M21 12.79A9 9 0 0111.21 3a9 9 0 108.01 8.01z" />
                                </svg>
                            ) : (
                                <svg
                                    className="w-6 h-6 text-sky-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="12" cy="12" r="5" />
                                    <path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41" />
                                </svg>
                            )}
                        </button>

                        <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-teal-300 drop-shadow">
                            Add New Staff
                        </h2>

                        <form className="space-y-5" autoComplete="off" onSubmit={handleAddStaff}>
                            {/* Staff ID */}
                            <div>
                                <label htmlFor="staffId" className="block text-sm font-medium text-gray-700">
                                    Staff ID
                                </label>
                                <input
                                    type="text"
                                    id="staffId"
                                    name="staffId"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Enter staff ID"
                                />
                            </div>

                            {/* Full Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Enter full name"
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Select role</option>
                                    <option value="doctor">Doctor</option>
                                    <option value="nurse">Nurse</option>
                                    <option value="admin">Admin</option>
                                    <option value="technician">Technician</option>
                                    <option value="midwife">Midwife</option>
                                </select>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="example@hospital.com"
                                />
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="+263 712 345 678"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-4 pt-4">
                                <motion.button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-2xl shadow-md bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold tracking-wide border-0 hover:scale-105 focus:scale-105 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                                    whileTap={{ scale: 0.97 }}
                                >
                                    Add Staff
                                </motion.button>
                                <motion.button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-6 py-2.5 rounded-2xl shadow-md bg-white text-blue-700 border border-gray-200 font-semibold hover:bg-gray-100 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    whileTap={{ scale: 0.97 }}
                                >
                                    Cancel
                                </motion.button>
                            </div>
                        </form>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
