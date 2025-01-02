const mongoose = require('mongoose');

// Define the schema for the prorogation request
const prorogationSchema = new mongoose.Schema({
  documentId: {
    type: String,
    required: true,  // Ensure the user ID is provided
  },
  type: {
    type: String,
    required:true
  },
  dueDate: {
    type: Date,
    required: true,  // The traite type (e.g., Traite, Letter, etc.)
  },
  motif: {
    type: String,
    required: true,  // The traite type (e.g., Traite, Letter, etc.)
  },
  echeanceDate: {
    type: Date,
    required: true,  // Document amount as a string (you can change to Number if required)
  },
});
// Create the model
const Prorogation = mongoose.model('Prorogation', prorogationSchema,'prorogation');

module.exports = Prorogation;
