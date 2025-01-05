const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const financementRoutes = require('./routes/FinancementRoutes');
const userRoutes = require('./routes/signIn')
const DashboardRoutes = require('./routes/dashboard')
const BuyerRoutes = require('./routes/buyer')
const DocumentRoutes = require('./routes/document')
const LitigeRoutes = require('./routes/litige')
const ProrogationRoutes = require('./routes/prorogation')
const limitRoutes = require('./routes/limit')
const recoverPassword = require('./routes/recover-password')
const createPassword = require('./routes/createnewpass')
const verifyOtp = require('./routes/verifyotp')
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3001;

const uploadDir = path.join(__dirname, 'uploads');
  
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


// Middleware
app.use(express.json());
app.use('/api', financementRoutes);
app.use('/api', userRoutes);
app.use('/api', DashboardRoutes);
app.use('/api', BuyerRoutes);
app.use('/api', DocumentRoutes);
app.use('/api', LitigeRoutes);
app.use('/api', ProrogationRoutes);
app.use('/api', limitRoutes);
app.use('/api', recoverPassword);
app.use('/api', verifyOtp);
app.use('/api', createPassword);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());





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
  