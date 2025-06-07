require("dotenv").config();
const pool = require("../poolfile");
const axios = require("axios");

let crudsObj = {};

crudsObj.postPatient = (patient) => {
  return new Promise((resolve, reject) => {
    console.log("honai patient:", patient);
    pool.query(
      `INSERT INTO patient (
        name, surname, age, dob, gender, id_number, allergies, hiv_status, phone, 
        address1, address2, email, 
        nok_name, nok_surname, nok_phone, 
        marital_status, spouse_name, spouse_surname, spouse_phone, spouse_email, 
        time_signed
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patient.name,
        patient.surname,
        patient.age,
        patient.dob,
        patient.gender,
        patient.id_number,
        patient.allergies,
        patient.hiv_status,
        patient.phone,
        patient.address1,
        patient.address2,
        patient.email,
        patient.nok_name,
        patient.nok_surname,
        patient.nok_phone,
        patient.marital_status,
        patient.spouse_name,
        patient.spouse_surname,
        patient.spouse_phone,
        patient.spouse_email,
        patient.time_signed
      ],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({ status: "200", message: "Saving successful" });
      }
    );
  });
};

crudsObj.getPatients = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM patient", (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

crudsObj.getPatientById = (patientId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM patient WHERE patient_id = ?",
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

crudsObj.getPatientByIdNum = (patientId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM patient WHERE id_number = ?",
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

crudsObj.updatePatient = (
  patientId,
updatedValues
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE patient SET 
        name = ?, 
        surname = ?, 
        age = ?, 
        dob = ?, 
        gender = ?, 
        id_number = ?,
        allergies = ?,
        hiv_status = ?, 
        phone = ?, 
        address1 = ?, 
        address2 = ?, 
        email = ?, 
        nok_name = ?, 
        nok_surname = ?, 
        nok_phone = ?, 
        marital_status = ?, 
        spouse_name = ?, 
        spouse_surname = ?, 
        spouse_phone = ?, 
        spouse_email = ?, 
        time_signed = ?
      WHERE patient_id = ?`,
      [
        updatedValues.name,
        updatedValues.surname,
        updatedValues.age,
        updatedValues.dob,
        updatedValues.gender,
        updatedValues.id_number,
        updatedValues.phone,
        updatedValues.allergies,
        updatedValues.hiv_status,
        updatedValues.address1,
        updatedValues.address2,
        updatedValues.email,
        updatedValues.nok_name,
        updatedValues.nok_surname,
        updatedValues.nok_phone,
        updatedValues.marital_status,
        updatedValues.spouse_name,
        updatedValues.spouse_surname,
        updatedValues.spouse_phone,
        updatedValues.spouse_email,
        updatedValues.time_signed,
        patientId
      ],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({ status: "200", message: "Update successful" });
      }
    );
  });
};

crudsObj.deletePatient = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM patient WHERE patient_id = ?", [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve({ status: "200", message: "update successful" });
    });
  });
};


module.exports = crudsObj;
