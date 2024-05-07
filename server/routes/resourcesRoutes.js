const express = require('express');
const path = require('path');
const router = express.Router();


// Serve static files from the 'docs' directory (Documentation)
router.use('/docs/backend', express.static(path.join(__dirname, '..', 'docs/backend')));
router.use('/docs/frontend', express.static(path.join(__dirname, '..', 'docs/frontend')));

// Serve static files from the 'test-results' directory (Test Results)
router.use('/test-results/frontend', express.static(path.join(__dirname, '..', 'frontend-test-results.txt')));
router.use('/test-results/backend', express.static(path.join(__dirname, '..', 'backend-test-results.txt')));

// Serve static files from the 'coverage-results' directory (Coverage Results)
router.use('/coverage-results', express.static(path.join(__dirname, '..', 'coverage-results')));

module.exports = router;

