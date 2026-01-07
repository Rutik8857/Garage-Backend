// const express = require('express');
// const router = express.Router();
// const { 
//   createCustomer, 
//   getAllCustomers 
// } = require('../controllers/customerController'); // Adjust path as needed

// // @route   POST /api/customers
// // @desc    Create a new customer
// router.post('/', createCustomer);

// // @route   GET /api/customers
// // @desc    Get all customers (for dropdowns)
// router.get('/', getAllCustomers);

// module.exports = router;


// This file defines all the API endpoints.
// It connects URLs to controller functions.

const express = require('express');
const router = express.Router();

// Import controllers
const customerController = require('../controllers/customerController');

// --- Customer Routes ---
// Corresponds to the "+ New Customer" modal

// GET /api/customers
// Fetches all customers to populate dropdowns
router.get('/', customerController.getAllCustomers);

// POST /api/customers
// Creates a new customer from the "AddCustomerModal"
router.post('/', customerController.createCustomer);

// DELETE /api/customers/:id
// Deletes a customer
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;