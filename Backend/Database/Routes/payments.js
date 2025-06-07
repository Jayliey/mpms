const express = require("express");
const paymentsRouter = express.Router();
const paymentsDbOperations = require("../Cruds/payments");

// Create a payment
paymentsRouter.post("/", async (req, res) => {
  try {
    const {
      patient_id,
      appointmentid,
      medicationid,
      paymenttype,
      description,
      receiptnumber,
      amount,
    } = req.body;

    const paymentToInsert = {
      patient_id,
      appointmentid,
      medicationid,
      paymenttype,
      description,
      receiptnumber,
      amount,
    };

    const results = await paymentsDbOperations.createPayment(paymentToInsert);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Get all payments
paymentsRouter.get("/", async (req, res) => {
  try {
    const payments = await paymentsDbOperations.getAllPayments();
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Get a payment by ID
paymentsRouter.get("/:id", async (req, res) => {
  try {
    const paymentId = req.params.id;
    const payment = await paymentsDbOperations.getPaymentById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Get all payments for a specific patient
paymentsRouter.get("/patient/:id", async (req, res) => {
  try {
    const patientId = req.params.id;
    const payments = await paymentsDbOperations.getPaymentsByPatientId(patientId);
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Patch a payment (partial update)
paymentsRouter.patch("/:id", async (req, res) => {
  try {
    const paymentId = req.params.id;
    const fieldsToUpdate = req.body;

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const results = await paymentsDbOperations.patchPayment(paymentId, fieldsToUpdate);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Update a payment
paymentsRouter.put("/:id", async (req, res) => {
  try {
    const paymentId = req.params.id;
    const updatedValues = req.body;

    const results = await paymentsDbOperations.updatePayment(paymentId, updatedValues);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Delete a payment
paymentsRouter.delete("/:id", async (req, res) => {
  try {
    const paymentId = req.params.id;
    const results = await paymentsDbOperations.deletePayment(paymentId);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = paymentsRouter;
