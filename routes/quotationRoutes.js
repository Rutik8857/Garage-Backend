const express = require('express');
const router = express.Router();

// Import controller
const { getAllQuotations, getQuotationById, updateQuotation, createQuotation, deleteQuotation } = require('../controllers/quotationController');

/**
 * @route   GET /api/quotations
 * @desc    Get all quotations
 * @access  Public (or Protected – based on your auth)
 */
router.get('/', getAllQuotations);

/**
 * @route   GET /api/quotations/:id
 * @desc    Get quotation by ID
 * @access  Public (or Protected – based on your auth)
 */
router.get('/:id', getQuotationById);

/**
 * @route   POST /api/quotations
 * @desc    Create a new quotation
 * @access  Public (or Protected)
 */
router.post('/', createQuotation);

/**
 * @route   PATCH /api/quotations/:id
 * @desc    Update an estimation (quotation) by its ID
 * @access  Public (or Protected)
 */
router.put('/:id', updateQuotation);

/**
 * @route   DELETE /api/quotations/:id
 * @desc    Delete a quotation by ID
 */
router.delete('/:id', deleteQuotation);

module.exports = router;
