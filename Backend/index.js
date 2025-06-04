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
const appointmentRouter = require("./Database/Routes/appointments");

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
};



//initialization//


app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use("/user", userRouter);
app.use("/patient", patientRouter);
app.use("/staff", staffRouter);
app.use("/role", roleRouter);
app.use("/appointment", appointmentRouter);

/////////////////



app.get("/", (req, res) => {
  res.send("App running");
});


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

