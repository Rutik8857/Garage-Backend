// This controller handles all logic related to transactions.

const db = require('../config/db'); // Import the database connection

/**
 * @desc    Get all transactions with filtering
 * @route   GET /api/transactions
 * @access  Public
 */
const getAllTransactions = async (req, res) => {
  try {
    // Get filter query parameters
    const { customerId, startDate, endDate } = req.query;

    let baseSql = `
      SELECT 
        t.id, 
        t.date, 
        c.customer_name AS customer, 
        t.particulars, 
        t.vch_type AS vchType, 
        t.amount, 
        t.status 
      FROM balance_sheets t
      JOIN customers c ON t.customer_id = c.id
    `;
    
    const whereClauses = [];
    const params = [];

    if (customerId) {
      whereClauses.push("t.customer_id = ?");
      params.push(customerId);
    }
    
    // The duration filter on the frontend is a single string "MM-DD-YYYY - MM-DD-YYYY"
    // We'd need to parse it. Or, for simplicity, assume 'startDate' and 'endDate' are sent.
    if (startDate) {
      whereClauses.push("t.date >= ?");
      params.push(startDate);
    }
    
    if (endDate) {
      whereClauses.push("t.date <= ?");
      params.push(endDate);
    }

    if (whereClauses.length > 0) {
      baseSql += " WHERE " + whereClauses.join(" AND ");
    }

    baseSql += " ORDER BY t.date DESC, t.id DESC";

    const [rows] = await db.query(baseSql, params);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error("Error in getAllTransactions:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

/**
 * @desc    Create a new transaction
 * @route   POST /api/transactions
 * @access  Public
 */
const createTransaction = async (req, res) => {
  const {
    customer, // This will be customer ID from the form
    particulars,
    remark,
    vchType,
    vchNumber,
    amount, // This should be a raw number from the frontend
    date,
    status
  } = req.body;

  // Basic validation
  if (!customer || !particulars || !vchType || !amount || !date || !status) {
    return res.status(400).json({ message: "Please fill in all required fields" });
  }

  try {
    const sql = `
      INSERT INTO balance_sheets 
      (customer_id, particulars, remark, vch_type, vch_number, amount, date, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.query(sql, [
      customer, // This should be the customer ID
      particulars,
      remark,
      vchType,
      vchNumber,
      amount, // Store the raw number
      date,
      status
    ]);

    // Send back the new transaction's ID
    res.status(201).json({ 
      success: true,
      id: result.insertId, 
      message: "Transaction created successfully" 
    });
  } catch (err) {
    console.error("Error in createTransaction:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

/**
 * @desc    Delete a transaction
 * @route   DELETE /api/transactions/:id
 * @access  Public
 */
const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = "DELETE FROM balance_sheets WHERE id = ?";
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.json({ success: true, message: "Transaction deleted successfully" });
  } catch (err) {
    console.error("Error in deleteTransaction:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = {
  getAllTransactions,
  createTransaction,
  deleteTransaction,
};