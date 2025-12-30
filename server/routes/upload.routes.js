
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { uploadEvidence } = require('../controllers/upload.controller');
const protect = require('../middleware/auth');

// Single file upload endpoint with metadata
router.post('/evidence', protect, upload.single('evidence'), uploadEvidence);

module.exports = router;
