const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const { Paynow } = require("paynow");
require('dotenv').config()


//import section//
const app = express();
const userRouter = require("./Database/Routes/user");
const patientRouter = require("./Database/Routes/patient");
const staffRouter = require("./Database/Routes/staff");
const roleRouter = require("./Database/Routes/roles");

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
};

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Get the token from the header
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }
      req.user = user; // Save user info in request
      next(); // Continue to the next middleware/route
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

//initialization//


app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use("/user", userRouter);
app.use("/patient", patientRouter);
app.use("/staff", staffRouter);
app.use("/role", roleRouter);

/////////////////



app.get("/", (req, res) => {
  res.send("App running");
});


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

