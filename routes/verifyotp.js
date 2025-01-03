const User = require("../models/user");
const express = require('express');
const router = express.Router();

// In-memory store for simplicity (use a proper database in production)

// Endpoint to verify OTP
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
  
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if OTP exists and is not expired
      if (user.resetPasswordToken !== otp) {
        console.log(user.resetPasswordToken)
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
    //   if (Date.now() > user.resetPasswordExpires) {
    //     return res.status(400).json({ message: 'OTP has expired' });
    //   }
  
      // OTP is valid, allow the user to reset their password
      res.status(200).json({ message: 'OTP is valid, you can now reset your password' });
  
      // You can also create a link to a password reset form, or handle the reset process here.
      // Example: sending a token for password reset
      // const resetToken = generateResetToken(); 
      // await sendPasswordResetLink(email, resetToken);
  
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  module.exports = router;
  