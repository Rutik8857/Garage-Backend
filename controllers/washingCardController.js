// const db = require('../config/db');

// /**
//  * @desc    Create a new washing card
//  * @route   POST /api/washing-cards
//  */
// const createWashingCard = async (req, res) => {
//   // Destructure data from the request body
//   const { vehicleNo, make, model, customerName, mobileNumber } = req.body;

//   // Server-side validation
//   if (!vehicleNo || !make || !customerName || !mobileNumber) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Please provide all required fields: vehicle number, make, customer name, and mobile number.' 
//     });
//   }

//   try {
//     const newCard = {
//       vehicle_no: vehicleNo,
//       make: make,
//       model: model,
//       customer_name: customerName,
//       mobile_number: mobileNumber,
//     };
    
//     const sql = 'INSERT INTO washing_job_card_services SET ?';
//     const [result] = await db.query(sql, [newCard]);

//     res.status(201).json({
//       success: true,
//       message: 'New washing card created successfully!',
//       jobId: result.insertId,
//     });
//   } catch (err) {
//     console.error('Error creating washing card:', err);
//     // Check for specific MySQL errors
//     if (err.code === 'ER_NO_SUCH_TABLE') {
//         return res.status(500).json({ success: false, message: "Database table 'washing_job_card_services' does not exist." });
//     }
//     res.status(500).json({ success: false, message: 'Failed to create washing card due to a server error.' });
//   }
// };

// /**
//  * @desc    Get all washing cards
//  * @route   GET /api/washing-cards
//  */
// const getAllWashingCards = async (req, res) => {
//   try {
//     const sql = 'SELECT * FROM washing_job_card_services ORDER BY created_at DESC';
//     const [jobs] = await db.query(sql);

//     res.status(200).json({
//       success: true,
//       count: jobs.length,
//       data: jobs,
//     });
//   } catch (err) {
//     console.error('Error fetching washing cards:', err);
//     res.status(500).json({ success: false, message: 'Failed to fetch washing cards due to a server error.' });
//   }
// };

// // Export all functions to be used in the routes file
// module.exports = {
//   createWashingCard,
//   getAllWashingCards,
// };



const db = require("../config/db"); // Adjust path as needed

/**
 * @desc    Create a new washing card
 * @route   POST /api/washing-cards
 * @access  Public
 */
exports.createWashingCard = async (req, res) => {
  // 1. Destructure data from the request body
  const { vehicle_no, make, model, customer_name, mobile_number } = req.body;

  // 2. Simple server-side validation (matches frontend 'required' fields)
  if (!customer_name || !mobile_number) {
    return res
      .status(400)
      .json({ message: "Customer Name and Mobile Number are required." });
  }

  try {
    // 3. Define the SQL query
    const sql = `
      INSERT INTO washing_job_cards 
      (vehicle_no, make, model, customer_name, mobile_number) 
      VALUES (?, ?, ?, ?, ?)
    `;

    // 4. Execute the query with sanitized inputs
    const [result] = await db.query(sql, [
      vehicle_no,
      make,
      model,
      customer_name,
      mobile_number,
    ]);

    // 5. Send a success response
    res.status(201).json({
      message: "Washing Card created successfully!",
      cardId: result.insertId,
      data: req.body,
    });
  } catch (error) {
    // 6. Handle any database errors
    console.error("Database Error:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not create washing card." });
  }
};

/**
 * @desc    Get all washing cards (Optional, but useful)
 * @route   GET /api/washing-cards
 * @access  Public
 */
exports.getAllWashingCards = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM washing_job_cards ORDER BY id DESC");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Database Error:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not fetch washing cards." });
  }
};