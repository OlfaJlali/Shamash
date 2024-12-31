const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    contractId: { type: String, required: true },
    amount: { type: Number, required: true }, 
    currentInvoices: { type: Number, required: true },
    guaranteeFund: { type: Number, required: true },
    reserveFund: { type: Number, required: true },
    overshootingBuyerLimit: { type: Number, required: true },
    });
  
  const Contract = mongoose.model('Contract', contractSchema, 'contract'); // Explicitly set collection name
  module.exports = Contract;
