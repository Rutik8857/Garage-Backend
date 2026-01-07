// routes/stockRoutes.js
const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// POST /api/stock (Create a new stock item)
router.post('/', stockController.createStockItem);

// GET /api/stock (Get all stock items, with category filter)
router.get('/', stockController.getStockItems);

// PUT /api/stock/:id (Update a stock item)
router.put('/:id', stockController.updateStockItem);

// DELETE /api/stock/:id (Delete a stock item)
router.delete('/:id', stockController.deleteStockItem);

module.exports = router;