require("dotenv").config();
const pool = require("../poolfile");
const axios = require("axios");

let crudsObj = {};

crudsObj.postStaff = (staff) => {
  return new Promise((resolve, reject) => {
    console.log("honai staff:", staff);
    pool.query(
      `INSERT INTO staff (
        role, name, surname, age, dob, gender, id_number, phone, 
        address1, address2, email, 
        nok_name, nok_surname, nok_phone, 
        marital_status, spouse_name, spouse_surname, spouse_phone, spouse_email, 
        time_signed
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        staff.role,
        staff.name,
        staff.surname,
        staff.age,
        staff.dob,
        staff.gender,
        staff.id_number,
        staff.phone,
        staff.address1,
        staff.address2,
        staff.email,
        staff.nok_name,
        staff.nok_surname,
        staff.nok_phone,
        staff.marital_status,
        staff.spouse_name,
        staff.spouse_surname,
        staff.spouse_phone,
        staff.spouse_email,
        staff.time_signed,
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

crudsObj.getStaffs = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM staff", (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

crudsObj.getStaffById = (staffId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM staff WHERE staff_id = ?",
      [staffId],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

crudsObj.updateStaff = (staffId, updatedValues) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE staff SET 
        role = ?,
        name = ?, 
        surname = ?, 
        age = ?, 
        dob = ?, 
        gender = ?, 
        id_number = ?, 
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
        spouse_email = ?
      WHERE staff_id = ?`,
      [
        updatedValues.role,
        updatedValues.name,
        updatedValues.surname,
        updatedValues.age,
        updatedValues.dob,
        updatedValues.gender,
        updatedValues.id_number,
        updatedValues.phone,
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
        staffId,
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

crudsObj.deleteStaff = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM staff WHERE staff_id = ?", [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve({ status: "200", message: "update successful" });
    });
  });
};

module.exports = crudsObj;
