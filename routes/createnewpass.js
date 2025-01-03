const User = require("../models/user");
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/create-password',  async (req, res) => {
    const {  email, newPassword } = req.body;
  
    // Validate input
    try {
      // Find the user by identifier
      const user = await User.findOne({ email:email });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      // Update the user's password
      user.password = hashedPassword;
      await user.save();
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });
  module.exports = router;
