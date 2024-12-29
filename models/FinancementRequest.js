const mongoose = require('mongoose');

// Define the schema for the financement request
const financementRequestSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,  // Ensure the user ID is provided
  },
  type: {
    type: String,
    required: true,  // The traite type (e.g., Traite, Letter, etc.)
  },
 
  document_amount: {
    type: String,
    required: true,  // Document amount as a string (you can change to Number if required)
  },
  document_date: {
    type: Date,
    required: true,  // The date the document was created
  },
  financement_type: {
    type: String,
    required: true,  // Specify the type of financement
  },

});

// Create the model
const FinancementRequest = mongoose.model('FinancementRequest', financementRequestSchema);

module.exports = FinancementRequest;
