const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    buyerId: { type: String, required: true },
    number: { type: Number, required: true }, 
    date: {type: Date, required: true},
    ttc:{type:Number,required: true},
    ouvert:{type:Number,required:true},
    retenu:{type:Number,required:true},
    });
  const Document = mongoose.model('Document', documentSchema, 'document'); // Explicitly set collection name
  module.exports = Document;
