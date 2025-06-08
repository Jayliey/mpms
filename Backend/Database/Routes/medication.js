const express = require("express");
const medicationRouter = express.Router();
const medicationDbOperations = require("../Cruds/medication");

// Create a new medication
medicationRouter.post("/", async (req, res) => {
  try {
    const medication = req.body;

    const result = await medicationDbOperations.postMedication(medication);
    res.json(result);
  } catch (error) {
    console.error("Error posting medication:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all medications by patient ID
medicationRouter.get("/patient/:id", async (req, res) => {
  try {
    const patientId = req.params.id;
    const results = await medicationDbOperations.getMedicationsByPatientId(patientId);

    res.json(results);
  } catch (error) {
    console.error("Error getting medications by patient ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get a single medication by ID
medicationRouter.get("/:id", async (req, res) => {
  try {
    const medicationId = req.params.id;
    const results = await medicationDbOperations.getMedicationById(medicationId);

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "Medication not found" });
    }

    res.json(results[0]); // send the single record
  } catch (error) {
    console.error("Error fetching medication:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

medicationRouter.get("/", async (req, res) => {
  try {
    const results = await medicationDbOperations.getMedication();

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "Medication not found" });
    }

    res.json(results); // Send all records
  } catch (error) {
    console.error("Error fetching medication:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Patch: Update a single column in medication
medicationRouter.patch("/medupdate/:id", async (req, res) => {

  try {
    const medicationId = req.params.id;
    const { column, value } = req.body;
    console.log(medicationId);
    // Validate column name against an allowed list to prevent SQL injection
    const allowedColumns = [
      "assigned_by", "description", "start_date", "end_date",
      "consumption_description", "consumption_status"
    ];

    if (!allowedColumns.includes(column)) {
      return res.status(400).json({ message: "Invalid column name" });
    }

    const result = await medicationDbOperations.patchMedication(medicationId, column, value);
    res.json(result);
  } catch (error) {
    console.error("Error patching medication:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Update medication
medicationRouter.put("/:id", async (req, res) => {
  try {
    const medicationId = req.params.id;
    const updatedValues = req.body;

    const result = await medicationDbOperations.updateMedication(medicationId, updatedValues);
    res.json(result);
  } catch (error) {
    console.error("Error updating medication:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete medication
medicationRouter.delete("/:id", async (req, res) => {
  try {
    const medicationId = req.params.id;

    const result = await medicationDbOperations.deleteMedication(medicationId);
    res.json(result);
  } catch (error) {
    console.error("Error deleting medication:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = medicationRouter;
