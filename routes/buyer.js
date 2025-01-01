
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const Buyer = require('../models/buyer');

router.get('/buyers', async (req, res) => {
    try {
        const { identifier, page = 1, limit = 10, search = '' } = req.query; // Added `search` query parameter
        const skip = (parseInt(page) - 1) * parseInt(limit);

        if (!identifier) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameter: identifier',
            });
        }

        // Build search filter
        const searchFilter = search
            ? { $or: [
                { firstname: { $regex: search, $options: 'i' } }, // Case-insensitive match
                { lastname: { $regex: search, $options: 'i' } },
              ] }
            : {};

        // Combine filters
        const filters = { userId: identifier, ...searchFilter };

        // Fetch paginated buyers
        const buyers = await Buyer.find(filters)
            .skip(skip)
            .limit(parseInt(limit));

        // Total count of buyers
        const totalBuyers = await Buyer.countDocuments(filters);

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