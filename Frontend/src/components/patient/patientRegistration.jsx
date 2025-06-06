import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { FaUser, FaVenusMars, FaRing, FaSun, FaMoon } from "react-icons/fa";
import { Link } from "react-router-dom"; // Make sure this is included

const inputBase =
  "peer w-full px-4 py-3 bg-transparent rounded-xl border border-neutral-300 dark:border-slate-700 outline-none text-base transition-all placeholder-transparent focus:border-blue-500 focus:shadow-lg dark:focus:border-teal-400 dark:text-neutral-100";
const labelBase =
  "absolute left-4 top-3 text-neutral-400 dark:text-neutral-500 text-base pointer-events-none transition-all duration-200 ease-in-out peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 dark:peer-placeholder-shown:text-neutral-600 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-500 dark:peer-focus:text-teal-400 bg-inherit px-1";

function AnimatedBG({ darkMode }) {
  return (
    <svg className="fixed inset-0 w-full h-full z-0 pointer-events-none" aria-hidden="true">
      <defs>
        <linearGradient id="a" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#3b82f6" stopOpacity={darkMode ? "0.18" : "0.13"} />
          <stop offset="1" stopColor="#06b6d4" stopOpacity={darkMode ? "0.11" : "0.08"} />
        </linearGradient>
        <radialGradient id="b">
          <stop stopColor="#818CF8" stopOpacity={darkMode ? "0.12" : "0.09"} />
          <stop offset="1" stopColor="transparent" />
        </radialGradient>
      </defs>
      <motion.ellipse
        cx="20%"
        cy="23%"
        rx="170"
        ry="100"
        fill="url(#a)"
        initial={{ opacity: 0, scale: 0.82, x: -80 }}
        animate={{
          opacity: 1,
          scale: [1.05, 1.17, 1.05],
          x: [0, 16, 0],
          y: [0, 10, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <motion.ellipse
        cx="80%"
        cy="80%"
        rx="110"
        ry="80"
        fill="url(#b)"
        initial={{ opacity: 0, scale: 1.1, x: 60 }}
        animate={{
          opacity: 0.55,
          scale: [1, 1.12, 1],
          x: [0, -22, 0],
          y: [0, -10, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
    </svg>
  );
}

export default function PatientRegistration() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const [success, setSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const maritalStatus = watch("marital_status");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/api/patients", data);
      if (response.data.status === "success") {
        setSuccess(true);
        reset();
      }
    } catch (error) {
      setSuccess(false);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-blue-100 via-sky-50 to-white"
      }`}
      style={{
        fontFamily: "'Inter', 'Roboto', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <AnimatedBG darkMode={darkMode} />
      <main className="relative w-full z-10 max-w-xl">
        <motion.div
          className="rounded-3xl p-8 sm:p-12 backdrop-blur-xl bg-white/60 dark:bg-slate-900/70 shadow-2xl border border-neutral-100 dark:border-slate-800 ring-2 ring-blue-100/20 dark:ring-teal-900/30"
          style={{
            boxShadow: darkMode
              ? "0 10px 40px 0 rgba(20,20,28,0.22), 0 1.5px 7px 0 rgba(0,0,0,0.12)"
              : "0 10px 40px 0 rgba(120,130,140,0.13), 0 2px 12px 0 rgba(0,0,0,0.05)",
          }}
          initial={{ scale: 0.97, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.98, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.7 }}
        >
          <button
            type="button"
            onClick={() => setDarkMode((d) => !d)}
            aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
            className="absolute top-4 right-4 p-2 rounded-xl shadow-sm bg-white/70 dark:bg-slate-800/80 hover:bg-white/90 dark:hover:bg-slate-700/80 transition"
          >
            {darkMode ? (
              <FaSun className="w-6 h-6 text-yellow-400" />
            ) : (
              <FaMoon className="w-6 h-6 text-sky-600" />
            )}
          </button>

          <h2 className="text-2xl font-bold mb-8 text-blue-700 dark:text-teal-300 text-center flex items-center justify-center gap-2 drop-shadow">
            <FaUser className="inline mb-1" /> Patient Registration
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" autoComplete="off">
            <div className="relative">
              <input
                {...register("name", { required: "Name is required" })}
                className={inputBase}
                placeholder=" "
                aria-label="Name"
              />
              <label className={labelBase}>Name</label>
              {errors.name && (
                <span className="text-red-600 text-xs absolute left-4 top-14">{errors.name.message}</span>
              )}
            </div>

            <div className="relative">
              <input
                {...register("surname", { required: "Surname is required" })}
                className={inputBase}
                placeholder=" "
                aria-label="Surname"
              />
              <label className={labelBase}>Surname</label>
              {errors.surname && (
                <span className="text-red-600 text-xs absolute left-4 top-14">{errors.surname.message}</span>
              )}
            </div>

            <div className="relative">
              <input
                {...register("dob", { required: "Date of Birth is required" })}
                type="date"
                className={inputBase}
                placeholder=" "
                aria-label="Date of Birth"
              />
              <label className={labelBase}>Date of Birth</label>
              {errors.dob && (
                <span className="text-red-600 text-xs absolute left-4 top-14">{errors.dob.message}</span>
              )}
            </div>

            <div className="relative">
              <input
                {...register("id_number", { required: "ID Number is required" })}
                className={inputBase}
                placeholder=" "
                aria-label="ID Number"
              />
              <label className={labelBase}>ID Number</label>
              {errors.id_number && (
                <span className="text-red-600 text-xs absolute left-4 top-14">{errors.id_number.message}</span>
              )}
            </div>

            <div className="relative">
              <input
                {...register("address", { required: "Address is required" })}
                className={inputBase}
                placeholder=" "
                aria-label="Address"
              />
              <label className={labelBase}>Address</label>
              {errors.address && (
                <span className="text-red-600 text-xs absolute left-4 top-14">{errors.address.message}</span>
              )}
            </div>

            <div className="relative">
              <input
                {...register("contact", {
                  required: "Contact number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid phone number",
                  },
                })}
                className={inputBase}
                placeholder=" "
                aria-label="Phone Number"
                type="tel"
              />
              <label className={labelBase}>Phone Number</label>
              {errors.contact && (
                <span className="text-red-600 text-xs absolute left-4 top-14">{errors.contact.message}</span>
              )}
            </div>

            <fieldset className="flex gap-5 items-center mb-2" aria-label="Gender">
              <FaVenusMars className="text-blue-400 dark:text-teal-300 text-lg mb-0.5 mr-2" />
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  value="m"
                  {...register("gender", { required: "Gender is required" })}
                  className="accent-blue-500 dark:accent-teal-400"
                />
                <span className="text-base text-neutral-600 dark:text-neutral-200">Male</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  value="f"
                  {...register("gender", { required: "Gender is required" })}
                  className="accent-pink-500 dark:accent-yellow-300"
                />
                <span className="text-base text-neutral-600 dark:text-neutral-200">Female</span>
              </label>
              {errors.gender && (
                <span className="ml-2 text-red-600 text-xs">{errors.gender.message}</span>
              )}
            </fieldset>

            <fieldset className="flex gap-5 items-center mb-2" aria-label="Marital Status">
              <FaRing className="text-yellow-500 dark:text-teal-200 text-lg mb-0.5 mr-2" />
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  value="Single"
                  {...register("marital_status", { required: "Marital status is required" })}
                  className="accent-blue-400 dark:accent-teal-300"
                />
                <span className="text-base text-neutral-600 dark:text-neutral-200">Single</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  value="Married"
                  {...register("marital_status", { required: "Marital status is required" })}
                  className="accent-pink-400 dark:accent-teal-400"
                />
                <span className="text-base text-neutral-600 dark:text-neutral-200">Married</span>
              </label>
              {errors.marital_status && (
                <span className="ml-2 text-red-600 text-xs">{errors.marital_status.message}</span>
              )}
            </fieldset>

            <AnimatePresence initial={false}>
              {maritalStatus === "Married" && (
                <motion.div
                  key="spouse"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-3"
                >
                  <div className="relative">
                    <input
                      {...register("spouse_name", { required: "Spouse name is required" })}
                      className={inputBase}
                      placeholder=" "
                      aria-label="Spouse's Name"
                    />
                    <label className={labelBase}>Spouse's Name</label>
                    {errors.spouse_name && (
                      <span className="text-red-600 text-xs absolute left-4 top-14">{errors.spouse_name.message}</span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      {...register("spouse_contact", {
                        required: "Spouse contact number is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Invalid phone number",
                        },
                      })}
                      className={inputBase}
                      placeholder=" "
                      aria-label="Spouse's Contact Number"
                      type="tel"
                    />
                    <label className={labelBase}>Spouse's Contact Number</label>
                    {errors.spouse_contact && (
                      <span className="text-red-600 text-xs absolute left-4 top-14">{errors.spouse_contact.message}</span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-xl font-semibold tracking-wider shadow-lg transition-all text-lg ${
                isSubmitting
                  ? "bg-blue-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-teal-400 dark:from-teal-600 dark:to-blue-500 text-white hover:scale-105 focus:scale-105 focus:ring-2 focus:ring-blue-400 dark:focus:ring-teal-300"
              }`}
              whileTap={{ scale: 0.96 }}
              aria-disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </motion.button>

            <AnimatePresence>
              {success && (
                <motion.p
                  className="text-green-600 text-center font-medium pt-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                  role="status"
                >
                  Registration successful!
                </motion.p>
              )}
            </AnimatePresence>

            <div className="text-center pt-4">
              <Link
                to="/login"
                className="text-sm font-medium text-blue-600 dark:text-teal-300 hover:underline"
              >
                Already have an account? Login
              </Link>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
