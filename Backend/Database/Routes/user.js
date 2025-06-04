const express = require("express");
const userRouter = express.Router();
const usersDbOperations = require("../Cruds/user"); 



userRouter.post("/", async (req, res, next) => {
  try {
    const postedValues = req.body;
   
    const {
        	staff_id,
          email	,
          password,
          role

    } = postedValues;

    const userToInsert = {
          staff_id,
          email	,
          password,
          role
    };


    const results = await usersDbOperations.postUser(userToInsert);

    res.json(results);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); 
  }
});

userRouter.get("/", async (req, res, next) => {
  try {
    const users = await usersDbOperations.getUsers(); 
    res.json(users);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); 
  }
});

userRouter.get("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id; 
    const user = await usersDbOperations.getUserById(userId); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user); 
  } catch (error) {
    console.error(error);
    res.sendStatus(500); 
  }
});

userRouter.get("/login/:email/:password", async (req, res, next) => {
  try {
    const email = req.params.email;
    const password = req.params.password;
    const result = await usersDbOperations.getUserByCred(email, password);
    
    if (result) {
      res.json(result); // Send user data as JSON
    } else {
      res.status(401).json({ message: 'Invalid email or password' }); // Handle unauthorized access
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

userRouter.put("/:id", async (req, res, next) => {
  try {
    const user_id = req.params.id; 
    const updatedValues = req.body; 

    console.log("update", updatedValues);
    const results = await usersDbOperations.updateUser(user_id, updatedValues); 
    res.json(results);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); 
  }
});

userRouter.delete("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id; 
    const results = await usersDbOperations.deleteUser(userId); 
    res.json(results);
  } catch (error) {
    console.error(error);
    res.sendStatus(500); 
  }
});

module.exports = userRouter; 
