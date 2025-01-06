const express = require('express');
const multer = require('multer');
const { Bordereau } = require('../models/bordereauSchema');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Save files in the 'uploads' folder
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed'), false);
      }
      cb(null, true);
    },
  });
  
  router.post('/add-bordereau', upload.any(), async (req, res) => {
    try {
      const { bordereauAmount, bordereauYear, bordereauDate } = req.body;
      let parsedDocs;
      // Ensure req.body.docs is correctly parsed
      if (typeof req.body.docs === 'string') {
        parsedDocs = JSON.parse(req.body.docs);
      } else {
        parsedDocs = req.body.docs;
      }
  
      if (!parsedDocs || !parsedDocs.length) {
        return res.status(400).json({ message: 'Documents are required' });
      }
  
      // Map documents and link to uploaded files
      const documentsWithImages = parsedDocs.map((doc, index) => {
        const matchingFile = req.files.find(
          (file) => file.fieldname === `docs[${index}][scannedImage]`
        );
        console.log(doc ,'doc')
        return {
          docType: doc.docType || null,
          paymentMode: doc.paymentMode || null,
          reference: doc.reference || null,
          dueDate: doc.dueDate || null, // Ensure dueDate is passed
          docDate: doc.docDate || null, // Ensure docDate is passed
          amount: doc.amount || 0,
          scannedImage: matchingFile?.path || null,
        };
      });
      console.log('Processed documents:', documentsWithImages);

      const newBordereau = new Bordereau({
        bordereauAmount,
        bordereauYear,
        bordereauDate,
        docs: documentsWithImages,
      });
  
      const savedBordereau = await newBordereau.save();
  
      res.status(201).json({
        message: 'Bordereau created successfully',
        bordereau: savedBordereau,
      });
    } catch (error) {
      console.error('Error creating bordereau:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  module.exports = router;
  