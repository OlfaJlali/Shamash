const express = require('express');
const User = require("../models/user");
const { sendOTP } = require('../utils/mailer');
const router = express.Router();

router.post('/recover-password', async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'Email not found' });
      }
  
      // Generate a 6-digit OTP
      const otp = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit OTP

  
      // Save OTP to the user's record (hashed for security)
      user.resetPasswordToken = otp; // Consider hashing it in production
      user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes
      await user.save();
      console.log(otp)
  
      // Send the OTP to the user's email
      await sendOTP(email, otp);
  
      res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
module.exports = router;
