// const db = require('../config/db'); // Your promise-based DB connection

// /**
//  * @desc    Create a new customer
//  * @route   POST /api/customers
//  */
// const createCustomer = async (req, res) => {
//   // Destructure all fields from the form
//   const { fullName, mobileNumber, address, gstin } = req.body;

//   // Server-side validation
//   if (!fullName || !mobileNumber) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Full Name and Mobile Number are required.' 
//     });
//   }

//   try {
//     const sql = `
//       INSERT INTO customers (full_name, mobile_number, address, gstin) 
//       VALUES (?, ?, ?, ?)
//     `;
    
//     const [result] = await db.query(sql, [fullName, mobileNumber, address, gstin]);

//     res.status(201).json({
//       success: true,
//       message: 'Customer added successfully!',
//       customerId: result.insertId,
//     });
//   } catch (err) {
//     // Handle errors, e.g., duplicate mobile number
//     console.error('Error creating customer:', err);
//     if (err.code === 'ER_DUP_ENTRY') {
//       return res.status(400).json({ success: false, message: 'A customer with this mobile number already exists.' });
//     }
//     res.status(500).json({ success: false, message: 'Server error. Please try again.' });
//   }
// };

// /**
//  * @desc    Get all customers
//  *_ @route   GET /api/customers
//  */
// const getAllCustomers = async (req, res) => {
//   try {
//     // Select only the fields needed for the dropdown
//     const sql = "SELECT id, full_name, mobile_number FROM customers ORDER BY full_name ASC";
//     const [customers] = await db.query(sql);
    
//     res.status(200).json({
//       success: true,
//       data: customers,
//     });
//   } catch (err) {
//     console.error('Error fetching customers:', err);
//     res.status(500).json({ success: false, message: 'Failed to fetch customers.' });
//   }
// };

// module.exports = {
//   createCustomer,
//   getAllCustomers,
// };


// This controller handles all logic related to customers.

const db = require('../config/db'); // Import the database connection

/**
 * @desc    Get all customers
 * @route   GET /api/customers
 * @access  Public
 */
const getAllCustomers = async (req, res) => {
  try {
    // Subqueries to count visits from both Job Cards and Washing Jobs based on mobile number
    const sql = `
      SELECT 
        c.id, c.customer_name, c.mobile_number, c.address, c.gstin,
        (
          (SELECT COUNT(*) FROM jobcards j WHERE j.mobile_number = c.mobile_number) + 
          (SELECT COUNT(*) FROM washing_job_cards w WHERE w.mobile_number = c.mobile_number)
        ) AS visit_count
      FROM customers c 
      ORDER BY c.id DESC
    `;
    const [rows] = await db.query(sql);
    
    // Return in a consistent format
    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error("Error in getAllCustomers:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

/**
 * @desc    Create a new customer
 * @route   POST /api/customers
 * @access  Public
 */
const createCustomer = async (req, res) => {
  // Get fields from the AddCustomerModal
  const { fullName, mobileNumber, address, gstin } = req.body;

  if (!fullName || !mobileNumber) {
    return res.status(400).json({ success: false, message: "Full Name and Mobile Number are required" });
  }

  try {
    const sql = "INSERT INTO customers (customer_name, mobile_number, address, gstin) VALUES (?, ?, ?, ?)";
    const [result] = await db.query(sql, [fullName, mobileNumber, address, gstin]);
    
    // Return the newly created customer's info
    res.status(201).json({
      success: true,
      id: result.insertId,
      customer_name: fullName, // Send back as customer_name to match getAllCustomers
      mobile_number: mobileNumber,
      address,
      gstin
    });
  } catch (err) {
    console.error("Error in createCustomer:", err.message);
    // Handle specific error for duplicate mobile number
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: "A customer with this mobile number already exists." });
    }
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

/**
 * @desc    Delete a customer
 * @route   DELETE /api/customers/:id
 * @access  Public
 */
const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: "Customer ID is required" });
  }

  try {
    const sql = "DELETE FROM customers WHERE id = ?";
    const [result] = await db.query(sql, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    res.json({ success: true, message: "Customer deleted successfully" });
  } catch (err) {
    console.error("Error in deleteCustomer:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = {
  getAllCustomers,
  createCustomer,
  deleteCustomer,
};