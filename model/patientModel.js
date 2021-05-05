const mongoose = require("mongoose");

// creating Schema for a pateient
const patientSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: [true, "Please enter your name"],
  },

  description: {
    type: String,
    required: true,
  },
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
