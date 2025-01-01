
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const Document = require('../models/document');
router.get('/documents', async (req, res) => {
    try {
        const { buyerId, page = 1, limit = 10, search = '' } = req.query; // Added `search` query parameter
        const skip = (parseInt(page) - 1) * parseInt(limit);

        if (!buyerId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameter: buyerId',
            });
        }

        // Build search filter
        const searchFilter = search
            ? { $or: [
                { number: { $regex: search, $options: 'i' } }, // Case-insensitive match
              ] }
            : {};

        // Combine filters
        const filters = { buyerId, ...searchFilter };

        // Fetch paginated documents
        const documents = await document.find(filters)
            .skip(skip)
            .limit(parseInt(limit));

        // Total count of documents
        const totaldocuments = await Document.countDocuments(filters);

        res.status(200).json({
            success: true,
            data: documents,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totaldocuments / limit),
                totaldocuments,
                pageSize: documents.length,
            },
        });
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
module.exports = router;
