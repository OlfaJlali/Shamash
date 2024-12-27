const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// // MongoDB connection
const mongoURI = "mongodb+srv://samashadmin:samashadmin@shamashit.j9gsp.mongodb.net/?retryWrites=true&w=majority&appName=ShamashIT";
// const mongoURI = process.env.MONGO_URI || 'your-mongodb-uri-here';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));



  const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstlogin: { type: Boolean, default: true }
  });
  
  const User = mongoose.model('User', userSchema);
  
  // Sign-In Route
  app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
  
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
  
    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
  
      // Generate JWT token (optional)
      const token = jwt.sign({ id: user._id }, 'your-secret-key', { expiresIn: '1h' });
  
      res.status(200).json({ message: 'Sign-in successful.', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });
  
  // Start server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  