
const express = require('express');
const Limit = require('../models/limit'); // Path to your model
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
router.post('/limit',authenticate,  async (req, res) => {
    const{ buyerId,
    requestDate,
    assurenceLimit,
    financementLimit,
    limitDate,
    lastRequestDate,
    requestedDelay,
    type } = req.body;

  // Validate input
  if (!buyerId ||!requestDate|| !assurenceLimit || !financementLimit || !limitDate || !lastRequestDate || !requestedDelay || !type) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Create a new financement request
    const newRequest = new Limit({
        buyerId,
        requestDate,
        assurenceLimit,
        financementLimit,
        limitDate,
        lastRequestDate,
        requestedDelay,
        type    });

    // Save the request to the database
    await newRequest.save();

    // Respond with the created request
    res.status(201).json({ message: 'limit created successfully.', request: newRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});
module.exports = router;
