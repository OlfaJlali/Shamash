const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const financementRoutes = require('./routes/FinancementRoutes');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use('/api', financementRoutes);

const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'XpertFactor API',
        version: '1.0.0',
        description: 'API documentation',
      },
      servers: [
    { url: 'https://shamash.onrender.com/', description: 'Staging server' },
    { url: 'http://localhost:3001', description: 'Local server' },
      
        
      ],
    },
    apis: ['./routes/*.js'], // Path to the API docs
  };
  const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  

// // MongoDB connection
const mongoURI = "mongodb+srv://samashadmin:samashadmin@shamashit.j9gsp.mongodb.net/XpertFactorDB?retryWrites=true&w=majority&appName=ShamashIT";
// const mongoURI = process.env.MONGO_URI || 'your-mongodb-uri-here';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });


  const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstlogin: { type: Boolean, default: true }
  });
  const User = mongoose.model('User', userSchema, 'user'); // Explicitly set collection name
  
  // Sign-In Route
  /**
 * @swagger
 * /signin:
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
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email of the user.
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
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstlogin:
 *                       type: boolean
 *       400:
 *         description: Missing or invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email and password are required.
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
        const all = await User.find()
        return res.status(404).json({ message: 'User not found.', all: all });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);  
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      } 
  
      // Generate JWT token (optional)
      const token = jwt.sign({ id: user._id }, 'your-secret-key', { expiresIn: '1h' });
  
      const userData = {
        _id: user._id,
        email: user.email,
        firstlogin: user.firstlogin,
        // Add any other fields you want to send back
      };
  
      // Respond with the token and user data
      res.status(200).json({ message: 'Sign-in successful.', token, user: userData });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });

  
  // Start server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  