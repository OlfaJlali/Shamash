
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const Contract = require('../models/contract');

/**
 * @swagger
 * /api/contracts/{userId}:
 *   get:
 *     summary: Get all contracts for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID to fetch contracts for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of contracts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   contractId:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   currentInvoices:
 *                     type: number
 *                   guaranteeFund:
 *                     type: number
 *                   reserveFund:
 *                     type: number
 *                   overshootingBuyerLimit:
 *                     type: number
 */
router.get('/contracts', async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: 'identifier is required' });
      }  
      const contracts = await Contract.find({userId});
      console.log(contracts)
      res.status(200).json(contracts);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  module.exports = router;

  