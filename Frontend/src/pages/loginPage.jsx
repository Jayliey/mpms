import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserNurse, FaUserMd, FaUserInjured, FaMoon, FaSun } from "react-icons/fa";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { API } from "../services/api";


const glass =
  "backdrop-blur-lg bg-white/60 dark:bg-slate-900/70 shadow-2xl ring-1 ring-neutral-200/50 dark:ring-slate-800/80";

const inputBase =
  "peer w-full px-4 py-3 bg-transparent rounded-xl border border-neutral-300 dark:border-slate-700 outline-none text-base transition-all placeholder-transparent focus:border-blue-500 focus:shadow-lg dark:focus:border-teal-400 dark:text-neutral-100";

const labelBase =
  "absolute left-4 top-3 text-neutral-400 dark:text-neutral-500 text-base pointer-events-none transition-all duration-200 ease-in-out peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 dark:peer-placeholder-shown:text-neutral-600 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-500 dark:peer-focus:text-teal-400 bg-inherit px-1";

function AnimatedBG({ darkMode }) {
  return (
    <svg
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="a" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#3b82f6" stopOpacity={darkMode ? "0.18" : "0.11"} />
          <stop offset="1" stopColor="#06b6d4" stopOpacity={darkMode ? "0.14" : "0.09"} />
        </linearGradient>
        <radialGradient id="b">
          <stop stopColor="#818CF8" stopOpacity={darkMode ? "0.13" : "0.09"} />
          <stop offset="1" stopColor="transparent" />
        </radialGradient>
      </defs>
      <motion.ellipse
        cx="20%"
        cy="26%"
        rx="170"
        ry="100"
        fill="url(#a)"
        initial={{ opacity: 0, scale: 0.85, x: -80 }}
        animate={{
          opacity: 1,
          scale: [1.1, 1.2, 1.1],
          x: [0, 10, 0],
          y: [0, 10, 0],
        }}
        transition={{ duration: 11, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <motion.ellipse
        cx="80%"
        cy="70%"
        rx="110"
        ry="80"
        fill="url(#b)"
        initial={{ opacity: 0, scale: 1.1, x: 60 }}
        animate={{
          opacity: 0.65,
          scale: [1, 1.12, 1],
          x: [0, -12, 0],
          y: [0, -6, 0],
        }}
        transition={{ duration: 14, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
    </svg>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("nurse");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const navigate =useNavigate();

  const firstInputRef = useRef();
  useEffect(() => {
    firstInputRef.current?.focus();
  }, [role]);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setError("");
    setUserId("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError("");
    if (role === "patient" && !userId) {
      setError("Please enter your ID number.");
      return;
    }else{
      await fetchPatient()
    }
    if ((role === "nurse" || role === "doctor") && (!email || !password)) {
      setError("Please fill in all fields.");
      return;
    }else{
      await fetchStaff();
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Logged in! (demo)");
    }, 1200);
  };


const fetchPatient = async() => {
         try {
        console.log("Logging in with:", userId);
        const response = await fetch(`${API}/patient/login/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (response.ok && result) {
          // Successful login logic here
          await Swal.fire('Success!', 'You have logged in successfully!', 'success');
          // onLogin(); // Call your login function to update state
          navigate("/dashboard"); // Uncomment to navigate to dashboard
        } else {
          await Swal.fire('Error!', result.message || 'Login failed. Please try again.', 'error');
        }
      } catch (error) {
        console.log("Error", error);
        await Swal.fire('Error!', 'An unexpected error occurred. Please try again.', 'error');
      }
}


const fetchStaff = async() => {
         try {
        console.log("Logging in with:", email, password);
        const response = await fetch(`${API}/user/login/${email}/${password}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (response.ok && result) {
          // Successful login logic here
          await Swal.fire('Success!', 'You have logged in successfully!', 'success');
          // onLogin(); // Call your login function to update state
          navigate("/dashboard"); // Uncomment to navigate to dashboard
        } else {
          await Swal.fire('Error!', result.message || 'Login failed. Please try again.', 'error');
        }
      } catch (error) {
        console.log("Error", error);
        await Swal.fire('Error!', 'An unexpected error occurred. Please try again.', 'error');
      }
}






  const roleOptions = [
    {
      value: "nurse",
      label: "Nurse",
      icon: <FaUserNurse className="text-blue-500 dark:text-teal-300" />,
    },
    {
      value: "doctor",
      label: "Doctor",
      icon: <FaUserMd className="text-violet-500 dark:text-teal-400" />,
    },
    {
      value: "patient",
      label: "Patient",
      icon: <FaUserInjured className="text-pink-500 dark:text-yellow-300" />,
    },
  ];

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-blue-100 via-sky-50 to-white"
      }`}
      style={{
        fontFamily:
          "'Inter', 'Roboto', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <AnimatedBG darkMode={darkMode} />

      <main className="relative w-full z-10 max-w-md">
        <AnimatePresence>
          <motion.div
            className={`rounded-3xl p-8 sm:p-10 ${glass} border border-neutral-100 dark:border-slate-800 ring-2 ring-blue-100/20 dark:ring-teal-900/30`}
            style={{
              boxShadow: darkMode
                ? "0 8px 36px 0 rgba(20,20,28,0.22), 0 1.5px 7px 0 rgba(0,0,0,0.12)"
                : "0 10px 40px 0 rgba(120,130,140,0.13), 0 2px 12px 0 rgba(0,0,0,0.05)",
            }}
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.7 }}
            role="dialog"
            aria-modal="true"
            aria-label="Login form"
          >
            {/* Theme Toggle */}
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

            <h2 className="text-2xl font-bold mb-8 text-blue-700 dark:text-teal-300 text-center drop-shadow">
              Welcome Back
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
              {/* Role Selector */}
              <fieldset className="flex justify-center gap-4 mb-3" aria-label="Select Role">
                {roleOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`group flex flex-col items-center px-5 py-2.5 rounded-xl cursor-pointer border transition-all
                      ${
                        role === opt.value
                          ? "border-blue-500 dark:border-teal-400 bg-blue-50/50 dark:bg-slate-800/60 shadow-lg"
                          : "border-transparent bg-transparent hover:bg-blue-100/40 dark:hover:bg-slate-700/60"
                      }`}
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      checked={role === opt.value}
                      onChange={handleRoleChange}
                      className="sr-only"
                    />
                    <span className={`text-2xl ${role === opt.value ? "scale-110" : "opacity-70"}`}>
                      {opt.icon}
                    </span>
                    <span
                      className={`font-semibold text-sm ${
                        role === opt.value
                          ? "text-blue-600 dark:text-teal-300"
                          : "text-neutral-500 dark:text-neutral-400"
                      }`}
                    >
                      {opt.label}
                    </span>
                  </label>
                ))}
              </fieldset>

              {/* Inputs */}
              <AnimatePresence mode="wait">
                {role === "patient" ? (
                  <motion.div
                    key="patient"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="relative mb-4">
                      <input
                        id="userId"
                        type="text"
                        ref={firstInputRef}
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                        className={inputBase}
                        placeholder=" "
                        aria-label="ID Number"
                      />
                      <label htmlFor="userId" className={labelBase}>
                        ID Number
                      </label>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="staff"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="relative mb-4">
                      <input
                        id="email"
                        type="email"
                        ref={firstInputRef}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={inputBase}
                        placeholder=" "
                      />
                      <label htmlFor="email" className={labelBase}>
                        Email Address
                      </label>
                    </div>
                    <div className="relative mb-4">
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={inputBase}
                        placeholder=" "
                        autoComplete="current-password"
                      />
                      <label htmlFor="password" className={labelBase}>
                        Password
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="text-red-600 font-medium text-sm mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    role="alert"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold tracking-wider shadow-lg transition-all text-lg ${
                  loading
                    ? "bg-blue-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-teal-400 dark:from-teal-600 dark:to-blue-500 text-white hover:scale-105 focus:scale-105 focus:ring-2 focus:ring-blue-400 dark:focus:ring-teal-300"
                }`}
                whileTap={{ scale: 0.97 }}
              >
                {loading ? "Signing In..." : "Sign In"}
              </motion.button>

              {/* Signup Link */}
              <div className="text-center text-sm mt-4">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Don't have an account?{" "}
                </span>
                <a
                  href="/signup"
                  className="font-medium text-blue-600 dark:text-teal-300 hover:underline"
                >
                  Sign up
                </a>
              </div>
            </form>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
