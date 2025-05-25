require("dotenv").config();
const pool = require("../poolfile");
const axios = require("axios");

let crudsObj = {};

crudsObj.postUser = (user) => {
  return new Promise((resolve, reject) => {
    let User = user;
    console.log("honai user:", User);
    pool.query(
      "INSERT INTO user(staff_id, email,password,role) VALUES (?,?,?,?)",
      [
          User.staff_id,
          User.email	,
          User.password,
          User.role

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

crudsObj.getUsers = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM user", (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

crudsObj.getUserById = (userId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM user WHERE user_id = ?",
      [userId],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

crudsObj.getUserByCred = (email, password) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM user WHERE email = ? AND password = ?",
      [email, password],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

crudsObj.updateUser = (
    id,updateValues
) => {
  console.log("from")
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE user SET  staff_id = ? , email = ? ,password = ? ,role = ? WHERE user_id = ?",
      [
          updateValues.staff_id,
          updateValues.email	,
          updateValues.password,
          updateValues.role,
          id
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

crudsObj.deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM user WHERE user_id = ?", [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve({ status: "200", message: "update successful" });
    });
  });
};


module.exports = crudsObj;
