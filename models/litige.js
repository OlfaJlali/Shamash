const mongoose = require('mongoose');

// Define the schema for the litige request
const litigeSchema = new mongoose.Schema({
  documentId: {
    type: String,
    required: true,  // Ensure the user ID is provided
  },
  type: {
    type: String,
    required:true
  },
  litigeDate: {
    type: Date,
    required: true,  // The traite type (e.g., Traite, Letter, etc.)
  },
 
  echeanceDate: {
    type: Date,
    required: true,  // Document amount as a string (you can change to Number if required)
  },
});
// Create the model
const Litige = mongoose.model('Litige', litigeSchema,'litige');

module.exports = Litige;
