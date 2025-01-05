const express = require('express'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
 const mongoose = require('mongoose');
 const router = express.Router();
 const multer = require('multer');

 const authenticate = require('../middleware/authMiddleware');
const User = require('../models/user');


 /**
 * @swagger
 * /api/signin:
 *   post:
 *     summary: User sign-in
 *     description: Authenticates a user and returns a JWT token along with user details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - password
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: The identifier of the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password of the user.
 *     responses:
 *       200:
 *         description: Sign-in successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sign-in successful.
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication.
 *                 user:
 *                   type: object
 *                   properties:
 *                     identifier:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstlogin:
 *                       type: boolean
 *       400:
 *         description: Missing or invalid identifier or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: identifier and password are required.
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid credentials.
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found.
 *                 all:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: All user records for debugging purposes.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
 router.post('/signin', async (req, res) => {
    const { identifier, password } = req.body;
    // Validate input
    if (!identifier || !password) {
      return res.status(400).json({ message: 'identifier and password are required.' });
    }
    try {
      // Find user by identifier
      const user = await User.findOne({ identifier });
      if (!user) {
        const all = await User.find()
        return res.status(404).json({ message: 'User not found.', all: all });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);  
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      } 
  
      // Generate JWT token (optional)
      const token = jwt.sign({ identifier: user.identifier }, 'your-secret-key', { expiresIn: '1h' });
  
      const userData = {
        identifier: user.identifier,
        email: user.email,
        firstlogin: user.firstlogin,
        name: user.name,
        phoneNumber: user.phoneNumber
        // Add any other fields you want to send back
      };
      console.log(userData ,'userData');
      console.log(user ,'user')

      // Respond with the token and user data
      res.status(200).json({ message: 'Sign-in successful.', token, user: userData });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });
  // Change Password Route
/**
 * @swagger
 * /api/changepassword:
 *   post:
 *     summary: Change the password of an authenticated user
 *     security:
 *       - bearerAuth: []  # Use JWT for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: The identifier of the user.
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 description: The current password of the user.
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: The new password to be set.
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password changed successfully.
 *       400:
 *         description: Missing or invalid fields in the request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All fields are required.
 *       401:
 *         description: Authentication failed or invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid credentials.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.post('/changepassword',authenticate,  async (req, res) => {
    const {  oldPassword, newPassword } = req.body;
  
    // Validate input
    if ( !oldPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const userId = req.user.identifier
    try {
      // Find the user by identifier
      const user = await User.findOne({ identifier:userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Verify the old password
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
  
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      // Update the user's password
      user.password = hashedPassword;
      await user.save();
  
      // Respond with success
      res.status(200).json({ message: 'Password changed successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });
  /**
 * @swagger
 * /api/edit-profile:
 *   patch:
 *     summary: Edit user profile
 *     description: Allows an authenticated user to update their phone number.
 *     security:
 *       - bearerAuth: []  # Use JWT for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - indetifier
 *               - phoneNumber
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: The identifier of the user.
 *               phoneNumber:
 *                 type: string
 *                 description: The new phone number of the user.
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully.
 *                 user:
 *                   type: object
 *                   properties:
 *                     identifier:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *       400:
 *         description: Missing or invalid fields in the request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Phone number is required.
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized.
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
  router.patch('/edit-profile', authenticate, async (req, res) => {
    const { phoneNumber , email } = req.body;
  
    if (!phoneNumber || !email) {
      return res.status(400).json({ message: 'Phone number and email are required.' });
    }
  
    try {
      const userId = req.user.identifier; // Extracted from the token by the middleware
      console.log(userId , 'userId')
      const user = await User.findOne({identifier:userId});
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      user.phoneNumber = phoneNumber;
      user.email = email
      await user.save();
  
      res.status(200).json({
        message: 'Profile updated successfully.',
        user: { identifier: user.identifier, email: user.email, phoneNumber: user.phoneNumber },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Specify the folder for uploads
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
      // Allow only image files
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed'), false);
      }
      cb(null, true);
    },
  });
  

// Endpoint to update profile picture
router.post('/update-profile-picture', upload.single('profilePicture'), async (req, res) => {
  const { identifier } = req.body;

  if (!identifier) {
    return res.status(400).json({ message: 'identifier is required' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Profile picture is required' });
  }

  try {
    const user = await User.findOne({ identifier });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's profile picture URL
    user.profilePicture = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      message: 'Profile picture updated successfully',
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

  
  
  module.exports = router;
