// This file defines all transaction API endpoints.

const express = require('express');
const router = express.Router();

// Import transaction controller
const transactionController = require('../controllers/transactionController');

// --- Transaction Routes ---
// Corresponds to the main balance sheet form and table

// GET /api/transactions
// Fetches transactions, with optional filtering
// e.g., /api/transactions?customerId=2&startDate=2021-01-01
router.get('/', transactionController.getAllTransactions);

// POST /api/transactions
// Creates a new transaction from the form on the left
router.post('/', transactionController.createTransaction);

// DELETE /api/transactions/:id
// Deletes a transaction using the "Delete" button
// e.g., /api/transactions/10
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
