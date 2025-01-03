const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    identifier: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstlogin: { type: Boolean, default: true },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  });
  const User = mongoose.model('User', userSchema, 'user'); // Explicitly set collection name
  module.exports = User;

