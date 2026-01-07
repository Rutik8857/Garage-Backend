const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

// GET /api/reports/search?customerName=...&vehicleNumber=...
router.post('/search', reportsController.searchJobCards);

// POST /api/reports/download
router.post('/download', reportsController.downloadExcelReport);

module.exports = router;
