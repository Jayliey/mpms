import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaUser, FaSun, FaMoon } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function PatientRegistration() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const [darkMode, setDarkMode] = useState(false);
  const [success, setSuccess] = useState(false);
  const maritalStatus = watch("marital_status");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      };

      const age = calculateAge(data.dob);
      const submissionData = { ...data, age };

      const response = await axios.post(
        "http://localhost:3001/patient/",
        submissionData
      );


      if (response.data.status == 200) {
        setSuccess(true);
        reset();

        await Swal.fire({
          title: "Success!",
          text: "You have registered successfully!",
          icon: "success",
          confirmButtonText: "Proceed",
          timer: 2000,
          timerProgressBar: true,
        });

        // Navigate after delay
        navigate("/login");
      }
    } catch (err) {
      Swal.fire("Error", "Registration failed. Please try again.", "error");
      setSuccess(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${
        darkMode ? "bg-slate-900" : "bg-gray-100"
      }`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-md rounded-2xl shadow-lg p-8 relative ${
          darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"
        }`}>
        <button
          onClick={() => setDarkMode((d) => !d)}
          className="absolute top-4 right-4 text-lg p-2 rounded-md hover:bg-opacity-20 transition">
          {darkMode ? (
            <FaSun className="text-yellow-400" />
          ) : (
            <FaMoon className="text-slate-700" />
          )}
        </button>

        <h2 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
          <FaUser /> Register Patient
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Name"
            placeholder="Enter name"
            error={errors.name}
            {...register("name", { required: "Name is required" })}
          />
          <Input
            label="Surname"
            placeholder="Enter surname"
            error={errors.surname}
            {...register("surname", { required: "Surname is required" })}
          />
          <Input
            label="Date of Birth"
            type="date"
            placeholder="Enter date of birth"
            error={errors.dob}
            {...register("dob", { required: "Date of Birth is required" })}
          />
          <Input
            label="ID Number"
            placeholder="Enter national ID"
            error={errors.id_number}
            {...register("id_number", { required: "ID Number is required" })}
          />
          <Input
            label="Address"
            placeholder="Enter residential address"
            error={errors.address}
            {...register("address1", { required: "Address is required" })}
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="Enter 10-digit phone number"
            error={errors.phone}
            {...register("phone", {
              required: "Contact number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Invalid phone number",
              },
            })}
          />

                    <Input
            label="Next_of_Kin's Name"
            placeholder="Enter the name of your Next of Kin"
            error={errors.nok_name}
            {...register("nok_name", {
              required: "Next of Kin's name is required",
            })}
          />
          <Input
            label="Next_of_Kin's Surname"
            placeholder="Enter the surname of your Next of Kin"
            error={errors.nok_surname}
            {...register("nok_surname", {
              required: "Next of Kin's surname is required",
            })}
          />
          <Input
            label="Next_of_Kin's Phone Number"
            type="tel"
            placeholder="Enter 10-digit phone number"
            error={errors.nok_phone}
            {...register("nok_phone", {
              required: "Next of Kin's phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Invalid phone number",
              },
            })}
          />

          <Select
            label="Gender"
            error={errors.gender}
            {...register("gender", { required: "Gender is required" })}
            options={[
              { value: "", label: "Select gender" },
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
          />

          <Select
            label="Marital Status"
            error={errors.marital_status}
            {...register("marital_status", {
              required: "Marital status is required",
            })}
            options={[
              { value: "", label: "Select status" },
              { value: "Single", label: "Single" },
              { value: "Married", label: "Married" },
            ]}
          />

          {maritalStatus === "Married" && (
            <>
              <Input
                label="Spouse's Name"
                placeholder="Enter spouse's full name"
                error={errors.spouse_name}
                {...register("spouse_name", {
                  required: "Spouse name is required",
                })}
              />
              <Input
                label="Spouse's Contact"
                type="tel"
                placeholder="Enter spouse's contact number"
                error={errors.spouse_contact}
                {...register("spouse_contact", {
                  required: "Spouse contact number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid phone number",
                  },
                })}
              />
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              isSubmitting
                ? "bg-blue-300 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}>
            {isSubmitting && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            )}
            {isSubmitting ? "Registering..." : "Register"}
          </button>

          {success && (
            <p className="text-green-500 text-sm text-center mt-2">
              Registration successful!
            </p>
          )}

          <div className="text-center pt-3">
            <Link to="/login" className="text-sm text-blue-500 hover:underline">
              Already have an account? Login
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// === Reusable Input ===
const Input = React.forwardRef(
  ({ label, type = "text", error, ...rest }, ref) => (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <input
        ref={ref}
        type={type}
        {...rest}
        className={`w-full px-4 py-2 rounded-lg border ${
          error ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-blue-400`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  )
);

// === Reusable Select ===
const Select = React.forwardRef(({ label, options, error, ...rest }, ref) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <select
      ref={ref}
      {...rest}
      className={`w-full px-4 py-2 rounded-lg border ${
        error ? "border-red-500" : "border-gray-300"
      } bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400`}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
  </div>
));
