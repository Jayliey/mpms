const express = require("express");
const staffRouter = express.Router();
const staffsDbOperations = require("../Cruds/staff");

staffRouter.post("/", async (req, res, next) => {
  try {
    const postedValues = req.body;

    const {
      role,
      name,
      surname,
      age,
      dob,
      gender,
      id_number,
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

    const staffToInsert = {
      role,
      name,
      surname,
      age,
      dob,
      gender,
      id_number,
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

    const results = await staffsDbOperations.postStaff(staffToInsert);

    res.json(results);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

staffRouter.get("/", async (req, res, next) => {
  try {
    const staffs = await staffsDbOperations.getStaffs();
    res.json(staffs);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

staffRouter.get("/:id", async (req, res, next) => {
  try {
    const staffId = req.params.id;
    const staff = await staffsDbOperations.getStaffById(staffId);

    if (!staff) {
      return res.status(404).json({ message: "staff not found" });
    }

    res.json(staff);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

staffRouter.put("/:id", async (req, res, next) => {
  try {
    const staffId = req.params.id;
    const updatedValues = req.body;

    const results = await staffsDbOperations.updateStaff(
      staffId,
      updatedValues
    );
    res.json(results);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

staffRouter.delete("/:id", async (req, res, next) => {
  try {
    const staffId = req.params.id;
    const results = await staffsDbOperations.deleteStaff(staffId);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = staffRouter;
