const mongoose = require('mongoose');

const docSchema = new mongoose.Schema({
    docType: { type: String, required: true },
    paymentMode: { type: String, required: true },
    amount: { type: Number, required: true },
    reference: { type: String, required: true },
    dueDate: { type: Date, required: false },
    docDate: { type: Date, required: false },
    scannedImage: { type: String, required: false }, // Path to the uploaded image
  });
  const Doc = mongoose.model('Doc', docSchema, 'doc'); // Explicitly set collection name

const bordereauSchema = new mongoose.Schema({
    bordereauAmount: { type: Number, required: true },
    bordereauYear: { type: Number, required: true },
    bordereauDate: { type: Date, required: true },
    docs: [docSchema], // Array of document objects
  });
  const Bordereau = mongoose.model('Bordereau', bordereauSchema, 'bordereau'); // Explicitly set collection name

  module.exports = {Doc,Bordereau};

  