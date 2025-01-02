
const express = require('express');
const Prorogation = require('../models/prorogation'); // Path to your model
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
router.post('/prorogation',authenticate,  async (req, res) => {
  const { documentId,type,dueDate,motif,echeanceDate } = req.body;
  // Validate input
  if (!documentId ||!type|| !dueDate || !motif || !echeanceDate) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Create a new financement request
    const newRequest = new Prorogation({
        documentId,
        type,
        dueDate,
        motif,
        echeanceDate,
    });

    // Save the request to the database
    await newRequest.save();

    // Respond with the created request
    res.status(201).json({ message: 'prorogation created successfully.', request: newRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});
module.exports = router;
