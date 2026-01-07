const express = require('express');
const router = express.Router();
const mmvController = require('../controllers/M_M_VController');

// VARIANTS routes
router.get('/:modelId', mmvController.getVariantsByModel);  // GET /api/variants/:modelId
router.post('/', mmvController.createVariant);              // POST /api/variants

module.exports = router;
