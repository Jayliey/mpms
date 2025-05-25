const express = require("express");
const roleRouter = express.Router();
const rolesDbOperations = require("../Cruds/roles"); 


roleRouter.post("/", async (req, res, next) => {
  try {
    const postedValues = req.body;
   
    const {
      value

    } = postedValues;

    const roleToInsert = {
      value
    };


    const results = await rolesDbOperations.postRole(roleToInsert);

    res.json(results);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); 
  }
});

roleRouter.get("/", async (req, res, next) => {
  try {
    const roles = await rolesDbOperations.getRoles(); 
    res.json(roles);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); 
  }
});

roleRouter.get("/:id", async (req, res, next) => {
  try {
    const roleId = req.params.id; 
    const role = await rolesDbOperations.getRoleById(roleId); 

    if (!role) {
      return res.status(404).json({ message: "role not found" });
    }

    res.json(role); 
  } catch (error) {
    console.error(error);
    res.sendStatus(500); 
  }
});

roleRouter.put("/:id", async (req, res, next) => {
  try {
    const roleId = req.params.id; 
    const updatedValues = req.body; 

    const results = await rolesDbOperations.updateRole(roleId, updatedValues); 
    res.json(results);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); 
  }
});

roleRouter.delete("/:id", async (req, res, next) => {
  try {
    const roleId = req.params.id; 
  const results = await rolesDbOperations.deleteRole(roleId); 
    res.json(results);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); 
  }
});

module.exports = roleRouter; 
