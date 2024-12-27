const express = require('express');
const FinancementRequest = require('../models/FinancementRequest'); // Path to your model
const router = express.Router();

// POST: Create a new financement request
router.post('/financement-request', async (req, res) => {
  const { userid, financement_type, document_amount, document_date, traite_type } = req.body;

  // Validate input
  if (!userid || !financement_type || !document_amount || !document_date || !traite_type) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Create a new financement request
    const newRequest = new FinancementRequest({
      userid,
      financement_type,
      document_amount,
      document_date,
      traite_type,
    });

    // Save the request to the database
    await newRequest.save();

    // Respond with the created request
    res.status(201).json({ message: 'Financement request created successfully.', request: newRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// GET: Fetch all financement requests
router.get('/financement-requests', async (req, res) => {
  try {
    const requests = await FinancementRequest.find();
    res.status(200).json({ requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching requests.' });
  }
});

// GET: Fetch a single financement request by ID
router.get('/financement-request/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const request = await FinancementRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    res.status(200).json({ request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching the request.' });
  }
});

// PUT: Update an existing financement request
router.put('/financement-request/:id', async (req, res) => {
  const { id } = req.params;
  const { userid, financement_type, document_amount, document_date, traite_type } = req.body;

  try {
    const updatedRequest = await FinancementRequest.findByIdAndUpdate(
      id,
      { userid, financement_type, document_amount, document_date, traite_type },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    res.status(200).json({ message: 'Request updated successfully.', request: updatedRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating the request.' });
  }
});

// DELETE: Delete a financement request
router.delete('/financement-request/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRequest = await FinancementRequest.findByIdAndDelete(id);
    if (!deletedRequest) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    res.status(200).json({ message: 'Request deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting the request.' });
  }
});

module.exports = router;
