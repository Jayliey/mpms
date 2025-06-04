// import React, { useState } from 'react';
// import axios from 'axios';

// function Login() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/api/login', {
//         username,
//         password
//       });
//       localStorage.setItem('token', response.data.token); // Store JWT
//       window.location.href = '/dashboard'; // Redirect to dashboard
//     } catch (error) {
//       alert('Login failed!');
//     }
//   };

//   return (
//     <form onSubmit={handleLogin}>
//       <input 
//         type="text" 
//         value={username} 
//         onChange={(e) => setUsername(e.target.value)} 
//         placeholder="Username" 
//       />
//       <input 
//         type="password" 
//         value={password} 
//         onChange={(e) => setPassword(e.target.value)} 
//         placeholder="Password" 
//       />
//       <button type="submit">Login</button>
//     </form>
//   );
// }

// export default Login;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MD5 from "crypto-js/md5";
import { API } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";


const particlesInit = async (main) => {
  await loadFull(main);
};

const glassBg =
  "backdrop-blur-md bg-white/60 dark:bg-[#181f34]/70 shadow-2xl border-[1.5px] border-white/30 dark:border-[#1f2937]/50";

const DARK_GRAD = "from-[#091024] to-[#20305a]";
const LIGHT_GRAD = "from-[#d8e6ff] to-[#f9fafb]";

function useDarkMode() {
  const [dark, setDark] = useState(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return [dark, setDark];
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [dark, setDark] = useDarkMode();

  // Particles config
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const fetchUserDetails = async () => {
    setLoading(true);
    setError("");
    // Uncomment and update for real API
    // try {
    //   const hashedPassword = MD5(password).toString();
    //   const response = await fetch(
    //     `${API}/users/login/${email}/${hashedPassword}`,
    //     { method: "GET", headers: { "Content-Type": "application/json" } }
    //   );
    //   const result = await response.json();
    //   setUserId(result[0].userid);
    //   const user = result[0].userid;
    //   const role = result[0].role;
    //   const username = result[0].username;
    //   if (response.ok && result.length > 0) {
    //     if (result[0].status === "active") {
    //       // Store in localStorage if needed (guarded)
    //       try {
    //         localStorage.setItem("adminId", user);
    //         localStorage.setItem("role", role);
    //         localStorage.setItem("userName", username);
    //       } catch (e) {}
    //       if (role === "Human Resources") navigate("/HrHome");
    //       else navigate("/Dashboard");
    //     }
    //   } else setError("Invalid credentials or user not found.");
    // } catch (e) {
    //   setError("Error connecting to server.");
    // }
    // Demo
    setTimeout(() => {
      setLoading(false);
      if (email === "admin@demo.com" && password === "admin") {
        setUserId("12345");
        navigate("/Dashboard");
      } else {
        setError("Invalid credentials or user not found.");
      }
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    fetchUserDetails();
  };

  // Input field animations
  const inputAnim = {
    rest: { y: 0, boxShadow: "0 1px 8px 0 rgba(0,0,0,0.07)", scale: 1 },
    hover: { y: -2, scale: 1.02, boxShadow: "0 7px 24px 0 rgba(0,0,0,0.10)" },
    focus: {
      y: -4,
      scale: 1.025,
      boxShadow: "0 10px 32px 0 rgba(0,0,0,0.12)",
      transition: { duration: 0.18 },
    },
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-700
        bg-gradient-to-br ${
          dark ? DARK_GRAD : LIGHT_GRAD
        } relative overflow-hidden`}
    >
      {/* Animated BG Particles */}
      <Particles
   id="tsparticles"
  init={particlesInit}
  options={{
    fullScreen: false,
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    particles: {
      number: { value: 100 },
      size: { value: 3 },
      move: { enable: true, speed: 1 },
      links: { enable: true },
      opacity: { value: 0.5 },
            shape: { type: "circle" },
          },
          detectRetina: true,
        }}
      />

      {/* Dark/Light Mode Toggle */}
      <button
        aria-label="Toggle dark mode"
        className="absolute top-6 right-8 z-20 bg-white/70 dark:bg-[#1f2937]/80 rounded-full p-2 shadow-md border border-gray-200 dark:border-[#22223c] transition hover:scale-105"
        onClick={() => setDark((d) => !d)}
        tabIndex={0}
      >
        <span className="sr-only">Toggle dark mode</span>
        {dark ? (
          <svg width="22" height="22" fill="none" className="text-yellow-400">
            <path
              d="M17.657 16.243A8 8 0 0 1 7.757 6.343a7 7 0 1 0 9.9 9.9z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg width="22" height="22" fill="none" className="text-[#002966]">
            <circle
              cx="11"
              cy="11"
              r="5.6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <g stroke="currentColor" strokeWidth="2">
              <line x1="11" y1="1.5" x2="11" y2="4" />
              <line x1="11" y1="18" x2="11" y2="20.5" />
              <line x1="1.5" y1="11" x2="4" y2="11" />
              <line x1="18" y1="11" x2="20.5" y2="11" />
              <line x1="4.22" y1="4.22" x2="6.05" y2="6.05" />
              <line x1="17.95" y1="17.95" x2="15.78" y2="15.78" />
              <line x1="4.22" y1="17.78" x2="6.05" y2="15.95" />
              <line x1="17.95" y1="4.05" x2="15.78" y2="6.22" />
            </g>
          </svg>
        )}
      </button>

      <main className="w-full max-w-md z-10">
        {/* Neumorphic+Glass Login Card */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 46, damping: 12 }}
          className={`rounded-3xl px-8 py-10 ${glassBg} space-y-8 relative transition-colors duration-700`}
          aria-label="Login form card"
        >
          <div className="text-center">
            <motion.h1
              className={`text-3xl font-black mb-2
              ${
                dark
                  ? "text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.12)]"
                  : "text-[#002966] drop-shadow-[0_1px_6px_rgba(0,41,102,0.07)]"
              }`}
              initial={{ letterSpacing: "-0.1em" }}
              animate={{ letterSpacing: "0em" }}
              transition={{ delay: 0.2, duration: 0.5, type: "tween" }}
            >
              Welcome Back
            </motion.h1>
            <p className="text-gray-600 dark:text-gray-300">
              Please sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7" autoComplete="off">
            {/* Email */}
            <motion.div
              variants={inputAnim}
              initial="rest"
              whileHover="hover"
              whileFocus="focus"
              className="space-y-2"
            >
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-200 block"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#002966] dark:text-yellow-400">
                  <svg width="22" height="22" fill="none">
                    <path
                      d="M2 6.5A2.5 2.5 0 0 1 4.5 4h13A2.5 2.5 0 0 1 20 6.5v9A2.5 2.5 0 0 1 17.5 18h-13A2.5 2.5 0 0 1 2 15.5v-9Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M3.5 7 11 12.5 18.5 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  aria-label="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-11 pr-4 py-3 w-full rounded-lg border border-gray-200 dark:border-[#283253] bg-white/80 dark:bg-[#202e43]/90 text-[#002966] dark:text-yellow-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-[#ffc000] focus:border-transparent transition duration-200 outline-none font-medium shadow-md"
                  placeholder="Enter your email"
                  autoComplete="username"
                />
              </div>
            </motion.div>
            {/* Password */}
            <motion.div
              variants={inputAnim}
              initial="rest"
              whileHover="hover"
              whileFocus="focus"
              className="space-y-2"
            >
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 dark:text-gray-200 block"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#002966] dark:text-yellow-400">
                  <svg width="22" height="22" fill="none">
                    <rect
                      x="3.5"
                      y="10"
                      width="15"
                      height="7"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="11"
                      cy="13.5"
                      r="1.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M7 10V7.5a4 4 0 1 1 8 0V10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  aria-label="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-11 pr-4 py-3 w-full rounded-lg border border-gray-200 dark:border-[#283253] bg-white/80 dark:bg-[#202e43]/90 text-[#002966] dark:text-yellow-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-[#ffc000] focus:border-transparent transition duration-200 outline-none font-medium shadow-md"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>
            </motion.div>
            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="text-red-600 font-semibold flex items-center gap-2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  role="alert"
                >
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 20 20"
                    className="inline-block"
                  >
                    <circle
                      cx="10"
                      cy="10"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M10 6v4.5M10 14h.01"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            {/* Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-lg transition
                ${
                  loading
                    ? "bg-gray-400/70 text-white cursor-wait"
                    : "bg-gradient-to-r from-[#002966] to-[#ffc000] hover:from-[#ffc000] hover:to-[#002966] text-white shadow-xl active:scale-98"
                }
                focus:ring-2 focus:ring-[#ffc000] focus:outline-none`}
              whileTap={{ scale: 0.96 }}
              whileHover={
                !loading
                  ? { scale: 1.015, boxShadow: "0 6px 24px 0 rgba(0,0,0,0.11)" }
                  : {}
              }
              aria-busy={loading}
              aria-disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  {/* Eye-catching loader */}
                  <motion.span
                    className="inline-block w-5 h-5 rounded-full border-2 border-t-amber-400 border-b-[#002966] border-r-[#002966] border-l-amber-400 animate-spin"
                    aria-label="Signing in, please wait"
                  />
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>
          {/* Divider & Help */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white/70 dark:bg-[#181f34]/80 text-gray-500 dark:text-gray-300 font-medium">
                Need help?
              </span>
            </div>
          </div>
          {/* Forgot */}
          <div className="text-center">
            <motion.button
              type="button"
              className="text-[#002966] dark:text-[#ffc000] hover:underline hover:text-[#ffc000] dark:hover:text-[#002966] font-semibold transition duration-200"
              whileHover={{ scale: 1.05 }}
              tabIndex={0}
              onClick={() => alert("Forgot password flow coming soon!")}
            >
              Forgot Password?
            </motion.button>
          </div>
        </motion.div>
        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500 select-none">
          <span className="tracking-widest">© 2025 MPMS. All rights reserved.</span>
        </div>
      </main>
      {/* Subtle Noise Overlay for extra polish */}
      <div
        className="pointer-events-none fixed inset-0 z-20"
        aria-hidden="true"
        style={{
          background:
            "url('https://www.transparenttextures.com/patterns/noise.png') repeat",
          opacity: 0.035,
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
};

export default Login;
