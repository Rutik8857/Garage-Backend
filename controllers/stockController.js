// controllers/stockController.js
const db = require('../config/db');

// @desc    Create a new stock item
// @route   POST /api/stock
const createStockItem = async (req, res) => {
  const {
    productName,
    category,
    make,
    model,
    variant,
    unitPrice,
    stock,
  } = req.body;

  // Validation
  if (!productName || !category || !unitPrice) {
    return res.status(400).json({
      success: false,
      message: 'Product Name, Category, and Unit Price are required.',
    });
  }

  try {
    const sql = `
      INSERT INTO inventory (product_name, category, make, model, variant, unit_price, stock) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [
      productName,
      category,
      make,
      model,
      variant,
      unitPrice,
      stock,
    ]);
    res.status(201).json({
      success: true,
      message: 'Stock item added successfully!',
      itemId: result.insertId,
    });
  } catch (err) {
    console.error('Error creating stock item:', err);
    res
      .status(500)
      .json({ success: false, message: 'Server error: Could not add item.' });
  }
};

// @desc    Get all stock items (can filter by category)
// @route   GET /api/stock
// @query   ?category=job
const getStockItems = async (req, res) => {
  try {
    let sql = 'SELECT * FROM inventory ORDER BY created_at DESC';
    const params = [];

    // Check if a category filter is provided in the URL
    if (req.query.category) {
      sql = 'SELECT * FROM inventory WHERE category = ? ORDER BY created_at DESC';
      params.push(req.query.category);
    }

    const [items] = await db.query(sql, params);
    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (err) {
    console.error('Error fetching stock items:', err);
    res
      .status(500)
      .json({ success: false, message: 'Server error: Could not fetch items.' });
  }
};

// @desc    Update a stock item
// @route   PUT /api/stock/:id
const updateStockItem = async (req, res) => {
  const { id } = req.params;
  const { productName, category, make, model, variant, unitPrice, stock } =
    req.body;

  // Validation
  if (!productName || !category || !unitPrice) {
    return res.status(400).json({
      success: false,
      message: 'Product Name, Category, and Unit Price are required.',
    });
  }

  try {
    const sql = `
      UPDATE inventory 
      SET product_name = ?, category = ?, make = ?, model = ?, variant = ?, unit_price = ?, stock = ?
      WHERE id = ?
    `;
    const [result] = await db.query(sql, [
      productName,
      category,
      make,
      model,
      variant,
      unitPrice,
      stock,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Item not found.' });
    }
    res.status(200).json({ success: true, message: 'Item updated successfully.' });
  } catch (err) {
    console.error('Error updating stock item:', err);
    res
      .status(500)
      .json({ success: false, message: 'Server error: Could not update item.' });
  }
};

// @desc    Delete a stock item
// @route   DELETE /api/stock/:id
const deleteStockItem = async (req, res) => {
  const { id } = req.params;
  try {
    const sql = 'DELETE FROM inventory WHERE id = ?';
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Item not found.' });
    }
    res.status(200).json({ success: true, message: 'Item deleted successfully.' });
  } catch (err) {
    console.error('Error deleting stock item:', err);
    res
      .status(500)
      .json({ success: false, message: 'Server error: Could not delete item.' });
  }
};

module.exports = {
  createStockItem,
  getStockItems,
  updateStockItem,
  deleteStockItem,
};