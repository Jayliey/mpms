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
      payment_status,
      due,
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
      payment_status,
      due,
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
