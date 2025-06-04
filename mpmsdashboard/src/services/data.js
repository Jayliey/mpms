// src/data.js
export const patients = [
  { id: 1, name: "Alice Smith", age: 28, phone: "1234567890" },
  { id: 2, name: "Maria Johnson", age: 22, phone: "0987654321" },
];

export const staff = [
  { id: 1, name: "Dr. John Doe", role: "Doctor" },
  { id: 2, name: "Nurse Mary", role: "Nurse" },
];

export const appointments = [
  { appointment_id: 1, patient_id: 1, staff_id: 1, appointment_type: "Antenatal", date: "2023-06-01", time: "10:00", status: "Scheduled" },
];

export const deliveries = [
  { delivery_id: 1, patient_id: 1, delivery_date: "2023-07-01", delivery_type: "Normal", staff_id: 1, birth_outcome: "Healthy", notes: "Normal delivery" },
];

export const labTests = [
  { test_id: 1, patient_id: 1, test_type: "Blood Test", date_ordered: "2023-05-20", result: "Normal", result_date: "2023-05-21", staff_id: 2 },
];

export const medications = [
  { medication_id: 1, patient_id: 1, drug_name: "Iron Supplements", dosage: "1 tablet daily", start_date: "2023-05-15", end_date: "2023-07-15", prescribed_by: 1 },
];

export const antenatalVisits = [
  { visit_id: 1, patient_id: 1, visit_date: "2023-05-30", blood_pressure: "120/80", fetal_heart_rate: "150", staff_id: 2, notes: "All normal" },
];

export const postnatalVisits = [
  { visit_id: 1, patient_id: 1, visit_date: "2023-07-10", checkup_details: "Healthy mother and baby", staff_id: 2, notes: "Follow up in a month" },
];

export const newborns = [
  { baby_id: 1, delivery_id: 1, sex: "Female", birth_weight: "3.5 kg", apgar_score: 9, vaccination_status: "Pending" },
];