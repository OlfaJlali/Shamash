const express = require('express');
const mongoose = require('mongoose');
const financementRoutes = require('./routes/FinancementRoutes');
const userRoutes = require('./routes/signIn')
const DashboardRoutes = require('./routes/dashboard')

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use('/api', financementRoutes);
app.use('/api', userRoutes);
app.use('/api', DashboardRoutes);




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

  
  // Sign-In Route


  
  // Start server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  