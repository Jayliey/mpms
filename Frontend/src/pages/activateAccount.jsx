import React, { useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

export default function StaffActivation() {
  const [formData, setFormData] = useState({
    staff_id: "",
    email: "",
    role: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Fetch staff by ID
      const staffRes = await fetch(`http://localhost:3001/staff/${formData.staff_id}`);
      if (!staffRes.ok) {
        throw new Error("Staff not found or invalid staff ID.");
      }

      // 2. Proceed to create user
      const userRes = await fetch("http://localhost:3001/user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!userRes.ok) {
        const errData = await userRes.json();
        throw new Error(errData.message || "Failed to create user.");
      }

      Swal.fire({
        icon: "success",
        title: "Account Activated!",
        text: "You can now log in with your credentials.",
      });

      setFormData({ staff_id: "", email: "", role: "", password: "" });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Activation Failed",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-white dark:from-slate-900 dark:to-slate-800 transition-colors">
      <motion.div
        className="w-full max-w-md p-8 rounded-3xl shadow-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 backdrop-blur"
        initial={{ scale: 0.95, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700 dark:text-teal-300">
          Staff Account Activation
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Staff ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Staff ID
            </label>
            <input
              type="text"
              name="staff_id"
              value={formData.staff_id}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-transparent dark:text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your Staff ID"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-transparent dark:text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your Email"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-transparent dark:text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-transparent dark:text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Create a Password"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-3 rounded-xl font-semibold text-white text-lg transition-all ${
              loading
                ? "bg-blue-300 dark:bg-slate-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-teal-400 dark:from-teal-600 dark:to-blue-500 hover:scale-105 focus:scale-105"
            }`}
          >
            {loading ? "Activating..." : "Activate Account"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
