
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const Contract = require('../models/contract');

/**
 * @swagger
 * /api/contracts:
 *   get:
 *     summary: Get all contracts for a specific user (via query parameter)
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose contracts you want to retrieve.
 *     responses:
 *       200:
 *         description: A list of contracts for the specified user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     description: The ID of the user.
 *                   amount:
 *                     type: string
 *                     description: The amount of the contract.
 *                   totalInvoices:
 *                     type: string
 *                     description: Total amount of current invoices.
 *                   totalGuaranteeFund:
 *                     type: string
 *                     description: Total of guarantee fund.
 *                   totalReserveFund:
 *                     type: string
 *                     description: Total of reserve fund.
 *                   totalOvershooting:
 *                     type: string
 *                     description: Total overshooting of buyer financial limit.
 *       400:
 *         description: Bad Request. Missing or invalid userId parameter.
 *       500:
 *         description: Internal server error.
 */
router.get('/contracts', authenticate, async (req, res) => {
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

  