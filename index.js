const express = require("express");
const mongoose = require("mongoose");
const Patient = require("./model/patientModel");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = express();
const server = require("http").createServer(app);
const socketIO = require("socket.io")(server, { cors: { origin: "*" } });

app.use(express.static("public"));

// Connect to local mongo db
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    autoIndex: true,
    poolSize: 10,
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 30000,
  })
  .then(() => {
    console.log("db local connection successful!!!!");
  });

// Listen server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Application is Listening at port ${port}.....`);
});

// socket io
socketIO.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // to load default data list if previously present
  Patient.find().then((result) => {
    console.log(result, "result");
    let patientData = [];
    result.map((data) => {
      patientData.push({
        patientName: data["patientName"],
        description: data["description"],
      });
    });
    socketIO.sockets.emit("patient-list", result);
  });

  // to load load data on  creation on new patient
  socket.on("add-patient", (data) => {
    const patient = new Patient(data);
    patient.save().then(() => {
      Patient.find().then((result) => {
        console.log(result, "result");
        let patientData = [];
        result.map((data) => {
          patientData.push({
            patientName: data["patientName"],
            description: data["description"],
          });
        });
        socketIO.sockets.emit("patient-list", result);
      });
    });
  });
});
