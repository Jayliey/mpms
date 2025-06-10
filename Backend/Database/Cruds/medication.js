require("dotenv").config();
const pool = require("../poolfile");

let crudsObj = {};

// Create new medication
crudsObj.postMedication = (medication) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO medication (
        patient_id,
        staff_id, 
        assigned_by, 
        description, 
        start_date, 
        end_date, 
        consumption_description, 
        consumption_status,
        time_prescribed
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, current_timestamp())`,
      [
        medication.patient_id,
        medication.staff_id,
        medication.assigned_by,
        medication.description,
        medication.start_date,
        medication.end_date,
        medication.consumption_description,
        medication.consumption_status || "Pending",
      ],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({ status: "200", message: "Medication saved successfully" });
      }
    );
  });
};

// Get all medications by patient ID
crudsObj.getMedicationsByPatientId = (patientId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM medication WHERE patient_id = ? ORDER BY time_prescribed DESC`,
      [patientId],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

// Get one medication by its ID
crudsObj.getMedicationById = (medicationId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM medication WHERE medication_id = ?`,
      [medicationId],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

crudsObj.getMedication = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM medication`,
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

crudsObj.patchMedication = (medicationId, column, value) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE medication SET \`${column}\` = ? WHERE medication_id = ?`;

    pool.query(query, [value, medicationId], (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve({ status: "200", message: `${column} updated successfully` });
    });
  });
};


// Update a medication
crudsObj.updateMedication = (medicationId, updatedValues) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE medication SET 
        assigned_by = ?, 
        description = ?, 
        start_date = ?, 
        end_date = ?, 
        consumption_description = ?, 
        consumption_status = ?
      WHERE medication_id = ?`,
      [
        updatedValues.assigned_by,
        updatedValues.description,
        updatedValues.start_date,
        updatedValues.end_date,
        updatedValues.consumption_description,
        updatedValues.consumption_status,
        medicationId,
      ],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({ status: "200", message: "Medication updated successfully" });
      }
    );
  });
};

// Delete a medication
crudsObj.deleteMedication = (medicationId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `DELETE FROM medication WHERE medication_id = ?`,
      [medicationId],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({ status: "200", message: "Medication deleted successfully" });
      }
    );
  });
};

module.exports = crudsObj;
