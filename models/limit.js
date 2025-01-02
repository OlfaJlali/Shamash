const mongoose = require('mongoose');

// Define the schema for the limit request
const limitSchema = new mongoose.Schema({
    buyerId: {
    type: String,
    required: true,  // Ensure the user ID is provided
  },
  requestDate: {
    type: String,
    required:true
  },
  assurenceLimit: {
    type: Number,
    required: true
  },
  financementLimit: {
    type: Number,
    required: true
  },
  limitDate: {
    type: Date,
    required: true,  // The traite type (e.g., Traite, Letter, etc.)
  },
  lastRequestDate: {
    type: Date,
    required: true,  // The traite type (e.g., Traite, Letter, etc.)
  },
  requestedDelay: {
    type: Number,
    required: true
  }, 
  type: {
    type: String,
    required: true,  // Document amount as a string (you can change to Number if required)
  },
});
// Create the model
const Limit = mongoose.model('Limit', limitSchema,'limit');

module.exports = Limit;

