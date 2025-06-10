require('dotenv').config()
const pool = require('../poolfile')
const axios = require('axios')

let crudsObj = {}

crudsObj.postAppointment = appointment => {
  return new Promise((resolve, reject) => {
    console.log('honai appointment:', appointment);
    pool.query(
      `INSERT INTO appointments (patient_id, staff_id, description, appointment_category, appointment_state, cost, payment_status, status, date, date_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, current_timestamp())`,
      [
        appointment.patient_id, 
        appointment.staff_id,
        appointment.description,
        appointment.appointment_category,
        appointment.appointment_state,
        appointment.cost,
        appointment.payment_status,
        appointment.status,
        appointment.date,
        appointment.date_created
      ],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({ status: '200', message: 'Saving successful' });
      }
    );
  });
};

crudsObj.getAppointments = () => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM appointments', (err, results) => {
      if (err) {
        return reject(err)
      }
      return resolve(results)
    })
  })
}

crudsObj.getAppointmentByPatientId = patientId => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM appointments WHERE patient_id = ?',
      [patientId],
      (err, results) => {
        if (err) {
          return reject(err)
        }
        return resolve(results)
      }
    )
  })
}

crudsObj.getAppointmentByPatientIdStatus = (patientId, status) => {
  console.log(status)
  console.log(patientId)
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM appointments WHERE patient_id = ? AND status = ?',
      [patientId, status],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

crudsObj.getAppointmentById = appointmentId => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM appointments WHERE appointment_id = ?',
      [appointmentId],
      (err, results) => {
        if (err) {
          return reject(err)
        }
        return resolve(results)
      }
    )
  })
}

crudsObj.updateAppointment = (appointmentId, updatedValues) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE appointments SET 
        staff_id = ?, 
        description = ?, 
        appointment_category = ?, 
        appointment_state = ?, 
        cost = ?,
        payment_status = ?, 
        status = ?, 
        date = ? 
      WHERE appointment_id = ?`,
      [
        updatedValues.staff_id,
        updatedValues.description,
        updatedValues.appointment_category,
        updatedValues.appointment_state,
        updatedValues.cost,
        updatedValues.payment_status,
        updatedValues.status,
        updatedValues.date,
        appointmentId
      ],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({ status: '200', message: 'Update successful' });
      }
    );
  });
};



crudsObj.patchPayment = (appointmentId, updatedFields) => {
  return new Promise((resolve, reject) => {
    const fields = Object.keys(updatedFields);
    const values = Object.values(updatedFields);

    if (fields.length === 0) {
      return resolve({ status: "400", message: "No fields to update" });
    }

    const setClause = fields.map(field => `${field} = ?`).join(", ");

    const sql = `UPDATE appointments SET ${setClause} WHERE appointment_id = ?`;

    pool.query(sql, [...values, appointmentId], (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve({ status: "200", message: "Patch update successful" });
    });
  });
};





crudsObj.deleteAppointment = id => {
  return new Promise((resolve, reject) => {
    pool.query(
      'DELETE FROM appointments WHERE appointment_id = ?',
      [id],
      (err, results) => {
        if (err) {
          return reject(err)
        }
        return resolve({ status: '200', message: 'update successful' })
      }
    )
  })
}

module.exports = crudsObj
