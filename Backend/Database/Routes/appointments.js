const express = require('express')
const appointmentRouter = express.Router()
const appointmentsDbOperations = require('../Cruds/appointments')

appointmentRouter.post('/', async (req, res, next) => {
  try {
    const postedValues = req.body

    const {
      patient_id,
      staff_id,
      description,
      appointment_category,
      appointment_state,
      cost,
      payment_status,
      status,
      date,
      date_created
    } = postedValues

    const appointmentToInsert = {
      patient_id,
      staff_id,
      description,
      appointment_category,
      appointment_state,
      cost,
      payment_status,
      status,
      date,
      date_created
    }

    const results = await appointmentsDbOperations.postAppointment(
      appointmentToInsert
    )

    res.json(results)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

appointmentRouter.get('/', async (req, res, next) => {
  try {
    const appointments = await appointmentsDbOperations.getAppointments()
    res.json(appointments)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

appointmentRouter.get('/patient/:id/:status', async (req, res, next) => {
  try {
    const patientId = req.params.id
    const status = req.params.status
    const appointment = await appointmentsDbOperations.getAppointmentByPatientIdStatus(
      patientId,
      status
    )

    if (!appointment) {
      return res.status(404).json({ message: 'appointment not found' })
    }
console.log("app", appointment)
    res.json(appointment)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

appointmentRouter.get('/patient/:id', async (req, res, next) => {
  try {
    const patientId = req.params.id
    const appointment = await appointmentsDbOperations.getAppointmentByPatientId(
      patientId
    )

    if (!appointment) {
      return res.status(404).json({ message: 'appointment not found' })
    }

    res.json(appointment)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

appointmentRouter.get('/:id', async (req, res, next) => {
  try {
    const appointmentId = req.params.id
    const appointment = await appointmentsDbOperations.getAppointmentById(
      appointmentId
    )

    if (!appointment) {
      return res.status(404).json({ message: 'appointment not found' })
    }

    res.json(appointment)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

appointmentRouter.patch("/patchy--update/:id", async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const fieldsToUpdate = req.body;

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const results = await appointmentsDbOperations.patchPayment(appointmentId, fieldsToUpdate);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

appointmentRouter.put('/:id', async (req, res, next) => {
  try {
    const appointmentId = req.params.id
    const updatedValues = req.body

    const results = await appointmentsDbOperations.updateAppointment(
      appointmentId,
      updatedValues
    )
    res.json(results)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

appointmentRouter.delete('/:id', async (req, res, next) => {
  try {
    const appointmentId = req.params.id
    const results = await appointmentsDbOperations.deleteAppointment(
      appointmentId
    )
    res.json(results)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

module.exports = appointmentRouter
