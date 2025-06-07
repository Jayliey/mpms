const pool = require("../poolfile");

let paymentsCrud = {};

// Create a payment
paymentsCrud.createPayment = (payment) => {
  return new Promise((resolve, reject) => {
    const {
      patient_id,
      appointmentid,
      medicationid,
      paymenttype,
      description,
      receiptnumber,
      amount,
    } = payment;

    pool.query(
      `INSERT INTO payments (
        patient_id, appointmentid, medicationid, paymenttype,
        description, receiptnumber, amount
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        patient_id,
        appointmentid,
        medicationid,
        paymenttype,
        description,
        receiptnumber,
        amount,
      ],
      (err, result) => {
        if (err) return reject(err);
        return resolve({
          status: "200",
          message: "Payment recorded successfully",
          payment_id: result.insertId,
        });
      }
    );
  });
};

// Get all payments
paymentsCrud.getAllPayments = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM payments", (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

// Get payment by ID
paymentsCrud.getPaymentById = (paymentId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM payments WHERE payment_id = ?",
      [paymentId],
      (err, results) => {
        if (err) return reject(err);
        return resolve(results[0]); // assuming single row
      }
    );
  });
};

// Get payments by patient ID
paymentsCrud.getPaymentsByPatientId = (patientId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM payments WHERE patient_id = ?",
      [patientId],
      (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      }
    );
  });
};

paymentsCrud.patchPayment = (paymentId, updatedFields) => {
  return new Promise((resolve, reject) => {
    const fields = Object.keys(updatedFields);
    const values = Object.values(updatedFields);

    if (fields.length === 0) {
      return resolve({ status: "400", message: "No fields to update" });
    }

    const setClause = fields.map(field => `${field} = ?`).join(", ");

    const sql = `UPDATE payments SET ${setClause} WHERE paymentid = ?`;

    pool.query(sql, [...values, paymentId], (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve({ status: "200", message: "Patch update successful" });
    });
  });
};

// Update a payment
paymentsCrud.updatePayment = (paymentId, updatedValues) => {
  const {
    patient_id,
    appointmentid,
    medicationid,
    paymenttype,
    description,
    receiptnumber,
    amount,
  } = updatedValues;

  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE payments SET 
        patient_id = ?, 
        appointmentid = ?, 
        medicationid = ?, 
        paymenttype = ?, 
        description = ?, 
        receiptnumber = ?, 
        amount = ? 
      WHERE payment_id = ?`,
      [
        patient_id,
        appointmentid,
        medicationid,
        paymenttype,
        description,
        receiptnumber,
        amount,
        paymentId,
      ],
      (err, result) => {
        if (err) return reject(err);
        return resolve({ status: "200", message: "Payment updated successfully" });
      }
    );
  });
};

// Delete a payment
paymentsCrud.deletePayment = (paymentId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM payments WHERE payment_id = ?",
      [paymentId],
      (err, result) => {
        if (err) return reject(err);
        return resolve({ status: "200", message: "Payment deleted successfully" });
      }
    );
  });
};

module.exports = paymentsCrud;
