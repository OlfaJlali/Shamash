
const express = require('express');
const Litige = require('../models/litige'); // Path to your model
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
router.post('/litige',authenticate,  async (req, res) => {
  const { documentId,litigeDate,echeanceDate,type } = req.body;

  // Validate input
  if (!documentId ||!type|| !litigeDate || !echeanceDate) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Create a new financement request
    const newRequest = new Litige({
        documentId,
        type,
        litigeDate,
        echeanceDate,
    });

    // Save the request to the database
    await newRequest.save();

    // Respond with the created request
    res.status(201).json({ message: 'litige created successfully.', request: newRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});
module.exports = router;
