const express = require('express');
const mongoose = require('mongoose');

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







// Sample Route
app.get('/', (req, res) => {
  res.send('Hello from Render + MongoDB!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
