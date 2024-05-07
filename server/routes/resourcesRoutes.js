const express = require('express');
const path = require('path');
const router = express.Router();

// Serve static files from the 'docs' directory (Documentation)
router.use('/docs', express.static(path.join(__dirname, '..', 'docs')));

// Serve static files from the 'test-results' directory (Test Results)
router.use('/test-results', express.static(path.join(__dirname, '..', 'test-results')));

module.exports = router;
