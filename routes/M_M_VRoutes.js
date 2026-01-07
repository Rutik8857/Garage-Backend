const express = require('express');
const router = express.Router();
const mmvController = require('../controllers/M_M_VController');

// MAKES routes
router.get('/', mmvController.getMakes);           // GET /api/makes
router.post('/', mmvController.createMake);        // POST /api/makes






module.exports = router;