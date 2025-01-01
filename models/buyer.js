const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true }, 
    picture: { type: String, required: true },
    documents: [{ type: String }],
    });
  
  const Buyer = mongoose.model('Buyer', buyerSchema, 'buyer'); // Explicitly set collection name
  module.exports = Buyer;
