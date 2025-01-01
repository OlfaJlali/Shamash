
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const Buyer = require('../models/buyer');

router.get('/buyers', async (req, res) => {
    try {
        const { identifer,  page = 1, limit = 10 } = req.query; // Default to page 1, limit 10
        const skip = (parseInt(page) - 1) * parseInt(limit);

        if (!identifer) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameter: identifer',
            });
        }


        // Fetch paginated buyers
        const buyers = await Buyer.find({userId : identifer})
            .skip(skip)
            .limit(parseInt(limit));

        // Total count of buyers
        const totalBuyers = await Buyer.countDocuments({ userId: identifer });

        res.status(200).json({
            success: true,
            data: buyers,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalBuyers / limit),
                totalBuyers,
                pageSize: buyers.length,
            },
        });
    } catch (error) {
        console.error('Error fetching buyers:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
module.exports = router