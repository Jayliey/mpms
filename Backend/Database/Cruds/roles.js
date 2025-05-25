require("dotenv").config();
const pool = require("../poolfile");
const axios = require("axios");

let crudsObj = {};

crudsObj.postRole = (role) => {
  return new Promise((resolve, reject) => {
    console.log("honai role:", role);
    pool.query(
      "INSERT INTO roles(value) VALUES (?)",
      [
          role.value,

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

crudsObj.getRoles = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM roles", (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

crudsObj.getRoleById = (roleId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM roles WHERE role_id = ?",
      [roleId],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

crudsObj.updateRole = (
    	    role_id,
         updatedValues

) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE roles SET  value = ? WHERE role_id = ?",
      [
          updatedValues.value,
          role_id
      ],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({ status: "200", message: "update successful" });
      }
    );
  });
};

crudsObj.deleteRole = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM roles WHERE role_id = ?", [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve({ status: "200", message: "update successful" });
    });
  });
};


module.exports = crudsObj;
