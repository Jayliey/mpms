const express = require("express");
const patientRouter = express.Router();
const patientsDbOperations = require("../Cruds/patient");

patientRouter.post("/", async (req, res, next) => {
  try {
    const postedValues = req.body;

    const {
      name,
      surname,
      age,
      dob,
      gender,
      id_number,
      allergies,
      hiv_status,
      phone,
      address1,
      address2,
      email,
      nok_name,
      nok_surname,
      nok_phone,
      marital_status,
      spouse_name,
      spouse_surname,
      spouse_phone,
      spouse_email,
      time_signed,
    } = postedValues;

    const patientToInsert = {
      name,
      surname,
      age,
      dob,
      gender,
      id_number,
      allergies,
      hiv_status,
      phone,
      address1,
      address2,
      email,
      nok_name,
      nok_surname,
      nok_phone,
      marital_status,
      spouse_name,
      spouse_surname,
      spouse_phone,
      spouse_email,
      time_signed,
    };

    const results = await patientsDbOperations.postPatient(patientToInsert);

    res.json(results);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

patientRouter.get("/", async (req, res, next) => {
  try {
    const patients = await patientsDbOperations.getPatients();
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

patientRouter.get("/:id", async (req, res, next) => {
  try {
    const patientId = req.params.id;
    const patient = await patientsDbOperations.getPatientById(patientId);

    if (!patient) {
      return res.status(404).json({ message: "patient not found" });
    }

    res.json(patient);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

patientRouter.get("/login/:id", async (req, res, next) => {
  try {
    const patientId = req.params.id;
    const patient = await patientsDbOperations.getPatientByIdNum(patientId);

    if (!patient) {
      return res.status(404).json({ message: "patient not found" });
    }

    res.json(patient);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

patientRouter.put("/:id", async (req, res, next) => {
  try {
    const patientId = req.params.id;
    const updatedValues = req.body;

    const results = await patientsDbOperations.updatePatient(
      patientId,
      updatedValues
    );
    res.json(results);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

patientRouter.delete("/:id", async (req, res, next) => {
  try {
    const patientId = req.params.id;
    const results = await patientsDbOperations.deletePatient(patientId);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = patientRouter;
