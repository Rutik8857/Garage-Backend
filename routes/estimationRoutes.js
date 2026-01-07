const express = require('express');
const router = express.Router();


// Import controller
const { getQuotationById, getEstimationByJobCardId, updateQuotation } = require('../controllers/estimationController');

/**
 * @route   GET /api/estimations/:id
 * @desc    Get quotation by ID
 * @access  Public (or Protected – based on your auth)
 */
router.get('/:id', getQuotationById);

/**
 * @route   GET /api/estimations/jobcard/:jobCardId/estimation
 * @desc    Get estimation by job card ID
 * @access  Public (or Protected – based on your auth)
 */
router.get('/jobcard/:jobCardId/estimation', getEstimationByJobCardId);

/**
 * @route   PATCH /api/estimations/:id
 * @desc    Update an estimation (quotation) by its ID
 * @access  Public (or Protected)
 */
router.patch('/:id', updateQuotation);




module.exports = router;
