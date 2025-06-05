import React, { useState, useMemo, useRef, useEffect } from "react";
import AddStaffModal from "./AddStaffModal";
import { URL } from "../services/endpoints";

const roleAvatars = {
  doctor: "🩺",
  nurse: "💉",
  admin: "🗂️",
  technician: "🔬",
  midwife: "🧑‍🍼",
  default: "👤",
};

const avatarColors = [
  "#7f5af0", "#f6c177", "#5adbb5", "#f875aa", "#90e0ef", "#cfbaf0"
];

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function getAvatar(role) {
  return roleAvatars[role] || roleAvatars.default;
}

export default function Staff() {
  const [search, setSearch] = useState("");
  const searchRef = useRef();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  const [modalOpen, setModalOpen] = useState(false);
  const [staff, setStaff] = useState([]); // Initialize with an empty array
  const [announce, setAnnounce] = useState("");

  useEffect(() => {
    const handler = (e) => {
      if ((e.key === "/" || e.key === "s") && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 800);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return staff;
    return staff.filter(member =>
      [member.staff_id, member.name, member.role].join(" ").toLowerCase().includes(q)
    );
  }, [search, staff]);

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    setAnnounce(filtered.length === 0 ? "No staff found." : "");
  }, [filtered.length]);

  const fetchStaff = async () => {
    try {
      const response = await fetch(`${URL}/staff/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setStaff(result); // Update the state with fetched data
      console.log("Fetched Staff:", result);
    } catch (error) {
      console.error("Error fetching Staff:", error);
    }
  };

  const handleAddStaff = async () => {
    // Handle staff addition logic
  };

  const handleEditStaff = (staffId) => {
    // Logic to edit staff
    console.log("Edit staff with ID:", staffId);
  };

  const handleDeleteStaff = async (staffId) => {
    // Logic to delete staff
    console.log("Delete staff with ID:", staffId);
  };

  return (
    <section className="relative mt-9 px-4">
      <header className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2" id="staff-heading" tabIndex={-1}>
          <svg width="29" height="29" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="#7f5af0" />
            <path d="M12 12c-2.5-3.5-6 0-1.5 4.5S17 12 12 12z" fill="#fff" />
          </svg>
          Staff
        </h2>

        <form
          className="mt-4 md:mt-0 flex items-center border border-gray-300 rounded-md px-3 py-2 w-full md:w-80 bg-white shadow-sm"
          role="search"
          aria-label="Search staff"
          onSubmit={(e) => e.preventDefault()}
        >
          <svg width="20" height="20" fill="none" stroke="#7f5af0" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" />
          </svg>
          <input
            ref={searchRef}
            className="ml-2 w-full outline-none"
            aria-label="Search staff"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
        </form>
      </header>

      <span className="sr-only" aria-live="polite">{announce}</span>

      {!isMobile ? (
        <table className="w-full table-auto border-collapse shadow rounded-md overflow-hidden bg-white">
          <thead className="bg-gray-100 text-left text-sm text-gray-700">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Gender</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No staff found.
                </td>
              </tr>
            ) : (
              filtered.map((member) => (
                <tr key={member.staff_id} className="border-t hover:bg-gray-50 focus-within:bg-gray-50">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{
                        background: `linear-gradient(120deg, ${stringToColor(member.name + member.staff_id)} 0%, #f6f7fb 100%)`
                      }}
                    >
                      {getAvatar(member.role)}
                    </span>
                    <span className="font-semibold">{member.staff_id}</span>
                  </td>
                  <td className="px-4 py-3 font-medium">{member.name} {member.surname}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block text-sm font-semibold text-violet-600 bg-gray-100 px-3 py-1 rounded-full capitalize">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">{member.email}</td>
                  <td className="px-4 py-3">{member.gender}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => handleEditStaff(member.staff_id)} aria-label="Edit">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 20h9" />
                        <path d="M15 17l5-5-2-2-5 5" />
                        <path d="M3 21v-2a2 2 0 0 1 2-2h2l6-6 2 2-6 6v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDeleteStaff(member.staff_id)} aria-label="Delete">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 6h18" />
                        <path d="M9 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6M10 2h4M4 6v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <div className="grid gap-4">
          {filtered.length === 0 ? (
            <div className="text-center text-gray-500">No staff found.</div>
          ) : (
            filtered.map((member) => (
              <div key={member.staff_id} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold"
                  style={{
                    background: `linear-gradient(120deg, ${stringToColor(member.name + member.staff_id)} 0%, #f6f7fb 100%)`
                  }}
                >
                  {getAvatar(member.role)}
                </span>
                <div className="flex-grow">
                  <div className="font-semibold">{member.name} {member.surname}</div>
                  <div className="text-sm text-gray-600">ID: {member.staff_id}</div>
                  <div className="text-sm">Email: {member.email}</div>
                  <div className="text-sm">Gender: {member.gender}</div>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => handleEditStaff(member.staff_id)} aria-label="Edit">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 20h9" />
                        <path d="M15 17l5-5-2-2-5 5" />
                        <path d="M3 21v-2a2 2 0 0 1 2-2h2l6-6 2 2-6 6v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDeleteStaff(member.staff_id)} aria-label="Delete">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 6h18" />
                        <path d="M9 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6M10 2h4M4 6v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Floating Plus Button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg"
        onClick={() => setModalOpen(true)}
        aria-label="Add staff"
      >
        +
      </button>

      {/* Add Staff Modal */}
      <AddStaffModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        handleAddStaff={handleAddStaff}
      />
    </section>
  );
}