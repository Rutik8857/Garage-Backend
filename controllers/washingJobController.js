// // controllers/washingJobController.js
// const db = require('../config/db');

// // Logic to create a new washing job
// const createWashingJob = async (req, res) => {
//   console.log('Received data:', req.body); // Add this for debugging
//   const { vehicle_no, make, model, customerName, mobileNumber } = req.body;

//   // Basic validation
//   if (!vehicle_no || !make || !customerName || !mobileNumber) {
//     return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
//   }

//   try {
//     const sql = 'INSERT INTO washing_jobs (vehicle_no, make, model, customer_name, mobile_number) VALUES (?, ?, ?, ?, ?)';
//     const [result] = await db.query(sql, [vehicle_no, make, model, customerName, mobileNumber]);

//     console.log('Database insert result:', result); // Add this for debugging
    
//     res.status(201).json({
//       success: true,
//       message: 'New washing job created successfully!',
//       jobId: result.insertId,
//     });
//   } catch (err) {
//     console.error('Error creating washing job:', err);
//     res.status(500).json({ success: false, message: 'Database insertion failed: ' + err.message });
//   }
// };

// module.exports = {
//   createWashingJob,
// };


// const db = require('../config/db');

// /**
//  * @desc    Create a new washing job
//  * @route   POST /api/washing-jobs
//  */
// const createWashingJob = async (req, res) => {
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
//     const sql = `
//       INSERT INTO washing_job_cards (vehicle_no, make, model, customer_name, mobile_number) 
//       VALUES (?, ?, ?, ?, ?)
//     `;
    
//     const [result] = await db.query(sql, [vehicleNo, make, model, customerName, mobileNumber]);

//     res.status(201).json({
//       success: true,
//       message: 'New washing job created successfully!',
//       jobId: result.insertId,
//     });
//   } catch (err) {
//     console.error('Error creating washing job:', err);
//     res.status(500).json({ success: false, message: 'Failed to create washing job due to a server error.' });
//   }
// };

// /**
//  * @desc    Get all washing jobs
//  * @route   GET /api/washing-jobs
//  */
// const getAllWashingJobs = async (req, res) => {
//   try {
//     const sql = 'SELECT * FROM washing_job_cards ORDER BY created_at DESC';
//     const [jobs] = await db.query(sql);

//     res.status(200).json({
//       success: true,
//       count: jobs.length,
//       data: jobs,
//     });
//   } catch (err) {
//     console.error('Error fetching washing jobs:', err);
//     res.status(500).json({ success: false, message: 'Failed to fetch washing jobs due to a server error.' });
//   }
// };

// /**
//  * @desc    Update the status of a washing job
//  * @route   PUT /api/washing-jobs/:id/status
//  */
// const updateWashingJobStatus = async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   // Validate the provided status
//   const allowedStatuses = ['pending', 'completed', 'closed'];
//   if (!status || !allowedStatuses.includes(status)) {
//     return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}.` });
//   }

//   try {
//     const sql = 'UPDATE washing_job_cards SET status = ? WHERE id = ?';
//     const [result] = await db.query(sql, [status, id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ success: false, message: 'Washing job not found with that ID.' });
//     }

//     res.status(200).json({
//       success: true,
//       message: `Washing job status updated to ${status}.`,
//     });
//   } catch (err) {
//     console.error('Error updating washing job status:', err);
//     res.status(500).json({ success: false, message: 'Failed to update status due to a server error.' });
//   }
// };

// // Export all functions to be used in the routes file
// module.exports = {
//   createWashingJob,
//   getAllWashingJobs,
//   updateWashingJobStatus,
// };

// const db = require('../config/db');

// /**
//  * @desc    Create a new washing job
//  * @route   POST /api/washing-jobs
//  */
// const createWashingJob = async (req, res) => {
//   const { vehicleNo, make, model, customerName, mobileNumber } = req.body;

//   // Server-side validation
//   if (!vehicleNo || !make || !customerName || !mobileNumber) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Please provide all required fields: vehicle number, make, customer name, and mobile number.' 
//     });
//   }

//   try {
//     const sql = `
//       INSERT INTO washing_job_cards (vehicle_no, make, model, customer_name, mobile_number) 
//       VALUES (?, ?, ?, ?, ?)
//     `;
    
//     const [result] = await db.query(sql, [vehicleNo, make, model, customerName, mobileNumber]);

//     res.status(201).json({
//       success: true,
//       message: 'New washing job created successfully!',
//       jobId: result.insertId,
//     });
//   } catch (err) {
//     console.error('Error creating washing job:', err);
//     res.status(500).json({ success: false, message: 'Failed to create washing job due to a server error.' });
//   }
// };

// /**
//  * @desc    Get all washing jobs
//  * @route   GET /api/washing-jobs
//  */
// const getAllWashingJobs = async (req, res) => {
//   try {
//     // This query now formats the ID and selects specific columns
//     // to match your frontend table
//     const sql = `
//       SELECT 
//         id, 
//         CONCAT('MCW-', YEAR(created_at), '-', id) AS srNo,
//         customer_name AS customerName,
//         vehicle_no AS vehicleNumber,
//         mobile_number AS mobileNumber,
//         status
//       FROM washing_job_cards 
//       ORDER BY created_at DESC
//     `;
//     const [jobs] = await db.query(sql);

//     res.status(200).json({
//       success: true,
//       count: jobs.length,
//       data: jobs,
//     });
//   } catch (err) {
//     console.error('Error fetching washing jobs:', err);
//     res.status(500).json({ success: false, message: 'Failed to fetch washing jobs due to a server error.' });
//   }
// };

// /**
//  * @desc    Update the status of a washing job
//  * @route   PUT /api/washing-jobs/:id/status
//  */
// const updateWashingJobStatus = async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   // Validate the provided status
//   const allowedStatuses = ['pending', 'completed', 'closed'];
//   if (!status || !allowedStatuses.includes(status)) {
//     return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}.` });
//   }

//   try {
//     const sql = 'UPDATE washing_job_cards SET status = ? WHERE id = ?';
//     const [result] = await db.query(sql, [status, id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ success: false, message: 'Washing job not found with that ID.' });
//     }

//     res.status(200).json({
//       success: true,
//       message: `Washing job status updated to ${status}.`,
//     });
//   } catch (err) {
//     console.error('Error updating washing job status:', err);
//     res.status(500).json({ success: false, message: 'Failed to update status due to a server error.' });
//   }
// };

// // Export all functions to be used in the routes file
// module.exports = {
//   createWashingJob,
//   getAllWashingJobs,
//   updateWashingJobStatus,
//   // new handlers
//   getWashingJobById,
//   updateWashingJob,
// };

// /**
//  * @desc    Get a single washing job by ID
//  * @route   GET /api/washing-jobs/:id
//  */
// async function getWashingJobById(req, res) {
//   const { id } = req.params;
//   try {
//     const sql = `SELECT * FROM washing_job_cards WHERE id = ?`;
//     const [rows] = await db.query(sql, [id]);
//     if (rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
//     return res.status(200).json({ success: true, data: rows[0] });
//   } catch (err) {
//     console.error('Error fetching washing job by id:', err);
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// }


// /**
//  * @desc    Update a washing job (full update)
//  * @route   PUT /api/washing-jobs/:id
//  */
// async function updateWashingJob(req, res) {
//   const { id } = req.params;
//   const updates = req.body || {};

//   // Debug logging: show incoming request body and id
//   console.log('[updateWashingJob] id=', id, 'updates=', JSON.stringify(updates));

//   // Build dynamic SET clause safely
//   // Restrict updates to columns that exist in the `washing_job_cards` table
//   // (avoid SQL errors for unknown columns). If you add columns to the DB,
//   // extend this list accordingly.
//   const allowed = [
//     'vehicle_no', 'make', 'model', 'customer_name', 'mobile_number', 'status'
//   ];

//   const setParts = [];
//   const values = [];
//   for (const key of allowed) {
//     if (Object.prototype.hasOwnProperty.call(updates, key) && updates[key] !== undefined) {
//       setParts.push(`${key} = ?`);
//       values.push(updates[key]);
//     }
//   }

//   if (setParts.length === 0) {
//     return res.status(400).json({ success: false, message: 'No valid fields provided for update.' });
//   }

//   try {
//     const sql = `UPDATE washing_job_cards SET ${setParts.join(', ')} WHERE id = ?`;
//     values.push(id);
//     // Log the prepared SQL and values for debugging
//     console.log('[updateWashingJob] SQL=', sql);
//     console.log('[updateWashingJob] values=', values);
//     const [result] = await db.query(sql, values);
//     if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Washing job not found.' });
//     return res.status(200).json({ success: true, message: 'Washing job updated.' });
//   } catch (err) {
//     console.error('Error updating washing job:', err && err.stack ? err.stack : err);
//     // include error message in response body to help client debugging (still 500)
//     return res.status(500).json({ success: false, message: 'Update failed due to server error.', error: err.message });
//   }
// }




// // controllers/washingJobController.js
// const db = require('../config/db');

// /**
//  * @desc    Create a new washing job
//  * @route   POST /api/washing-jobs
//  */
// const createWashingJob = async (req, res) => {
//   const { vehicleNo, make, model, customerName, mobileNumber } = req.body;

//   if (!vehicleNo || !make || !customerName || !mobileNumber) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Please provide all required fields: vehicle number, make, customer name, and mobile number.' 
//     });
//   }

//   try {
//     const sql = `
//       INSERT INTO washing_job_cards (vehicle_no, make, model, customer_name, mobile_number, status, created_at) 
//       VALUES (?, ?, ?, ?, ?, 'Open', NOW())
//     `;
//     const [result] = await db.query(sql, [vehicleNo, make, model, customerName, mobileNumber]);

//     res.status(201).json({
//       success: true,
//       message: 'New washing job created successfully!',
//       jobId: result.insertId,
//     });
//   } catch (err) {
//     console.error('Error creating washing job:', err);
//     res.status(500).json({ success: false, message: 'Server Error' });
//   }
// };

// /**
//  * @desc    Get all washing jobs
//  * @route   GET /api/washing-jobs
//  */
// const getAllWashingJobs = async (req, res) => {
//   try {
//     const sql = `
//       SELECT 
//         id, 
//         CONCAT('MCW-', YEAR(created_at), '-', id) AS srNo,
//         customer_name AS customerName,
//         vehicle_no AS vehicleNumber,
//         mobile_number AS mobileNumber,
//         status,
//         make,
//         model,
//         created_at
//       FROM washing_job_cards 
//       ORDER BY created_at DESC
//     `;
//     const [jobs] = await db.query(sql);

//     res.status(200).json({
//       success: true,
//       count: jobs.length,
//       data: jobs,
//     });
//   } catch (err) {
//     console.error('Error fetching washing jobs:', err);
//     res.status(500).json({ success: false, message: 'Server Error' });
//   }
// };

// /**
//  * @desc    Get a single washing job by ID
//  * @route   GET /api/washing-jobs/:id
//  */
// const getWashingJobById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const sql = `SELECT * FROM washing_job_cards WHERE id = ?`;
//     const [rows] = await db.query(sql, [id]);
    
//     if (rows.length === 0) {
//       return res.status(404).json({ success: false, message: 'Washing Job not found' });
//     }
    
//     return res.status(200).json({ success: true, data: rows[0] });
//   } catch (err) {
//     console.error('Error fetching washing job by id:', err);
//     return res.status(500).json({ success: false, message: 'Server Error' });
//   }
// };

// /**
//  * @desc    Update a washing job (Dynamic Update)
//  * @route   PUT /api/washing-jobs/:id
//  */
// const updateWashingJob = async (req, res) => {
//   const { id } = req.params;
//   const updates = req.body || {};

//   console.log('[updateWashingJob] Request:', { id, updates });

//   // List of columns that exist in your database table 'washing_job_cards'
//   const allowedColumns = [
//     'vehicle_no', 
//     'make', 
//     'model', 
//     'customer_name', 
//     'email', 
//     'customer_voice', 
//     'mobile_number', 
//     'status', 
//     'delivery_date', 
//     'delivery_time', 
//     'user_id', 
//     'labour_charge', 
//     'advance_amount', 
//     'bill_amount', 
//     'completion_datetime', 
//     'exit_datetime', 
//     'remind_period'
//   ];

//   const setParts = [];
//   const values = [];

//   // Iterate over allowed columns and check if they exist in the request body
//   for (const key of allowedColumns) {
//     if (Object.prototype.hasOwnProperty.call(updates, key) && updates[key] !== undefined) {
//       setParts.push(`${key} = ?`);
//       values.push(updates[key]);
//     }
//   }

//   // If no valid fields found to update
//   if (setParts.length === 0) {
//     return res.status(400).json({ success: false, message: 'No valid fields provided for update.' });
//   }

//   try {
//     // Add updated_at timestamp automatically
//     setParts.push(`updated_at = NOW()`);

//     const sql = `UPDATE washing_job_cards SET ${setParts.join(', ')} WHERE id = ?`;
//     values.push(id);

//     const [result] = await db.query(sql, values);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ success: false, message: 'Washing job not found.' });
//     }

//     // Optional: If you have a separate items table, handle item updates here
//     // ... item logic ...

//     return res.status(200).json({ success: true, message: 'Washing job updated successfully.' });
//   } catch (err) {
//     console.error('Error updating washing job:', err);
//     return res.status(500).json({ success: false, message: 'Update failed.', error: err.message });
//   }
// };

// /**
//  * @desc    Quick update status of a washing job
//  * @route   PUT /api/washing-jobs/:id/status
//  */
// const updateWashingJobStatus = async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   if (!status) {
//     return res.status(400).json({ success: false, message: 'Status is required.' });
//   }

//   try {
//     const sql = 'UPDATE washing_job_cards SET status = ?, updated_at = NOW() WHERE id = ?';
//     const [result] = await db.query(sql, [status, id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ success: false, message: 'Washing job not found.' });
//     }

//     res.status(200).json({
//       success: true,
//       message: `Washing job status updated to ${status}.`,
//     });
//   } catch (err) {
//     console.error('Error updating status:', err);
//     res.status(500).json({ success: false, message: 'Server Error' });
//   }
// };

// module.exports = {
//   createWashingJob,
//   getAllWashingJobs,
//   getWashingJobById,
//   updateWashingJob,
//   updateWashingJobStatus
// };




// const db = require('../config/db');

// /**
//  * @desc    Create a new washing job
//  * @route   POST /api/washing-jobs
//  */
// const createWashingJob = async (req, res) => {
//   // Destructure using snake_case to match Frontend Payload & DB Columns
//   const { 
//     vehicle_no, make, model, customer_name, mobile_number, 
//     email, customer_voice,
//     delivery_date, delivery_time, user_id, advance_amount, bill_amount,
//     completion_datetime, exit_datetime, remind_period, items 
//   } = req.body;

//   // Validation
//   if (!vehicle_no || !make || !customer_name || !mobile_number) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Please provide required fields: vehicle_no, make, customer_name, and mobile_number.' 
//     });
//   }

//   try {

//     const sql = `
//       INSERT INTO washing_job_cards (
//         vehicle_no, make, model, customer_name, mobile_number, email, customer_voice,
//         status, delivery_date, delivery_time, user_id, garage_name,
//         advance_amount, bill_amount, completion_datetime, exit_datetime, remind_period,
//         created_at, updated_at
//       ) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
//     `;

//     const values = [
//       vehicle_no, make, model, customer_name, mobile_number, email || null, customer_voice || null,
//       delivery_date || null, delivery_time || null, user_id || null, req.body.garage_name || null, 
//       advance_amount || 0, bill_amount || 0, completion_datetime || null, exit_datetime || null, remind_period || null
//     ];

//     const [result] = await db.query(sql, values);
//     const newJobId = result.insertId;

//     // Optional: Insert Items if you have a separate table
//     if (items && Array.isArray(items) && items.length > 0) {
//        // Logic to insert items into washing_job_items table would go here
//        // ...
//     }

//     res.status(201).json({
//       success: true,
//       message: 'New washing job created successfully!',
//       jobId: newJobId,
//     });
//   } catch (err) {
//     console.error('Error creating washing job:', err);
//     res.status(500).json({ success: false, message: 'Server Error', error: err.message });
//   }
// };

// /**
//  * @desc    Get all washing jobs
//  * @route   GET /api/washing-jobs
//  */
// const getAllWashingJobs = async (req, res) => {
//   try {
//     const sql = `
//       SELECT 
//         id, 
//         CONCAT('MCW-', YEAR(created_at), '-', id) AS srNo,
//         customer_name AS customerName,
//         vehicle_no AS vehicleNumber,
//         mobile_number AS mobileNumber,
//         status,
//         make,
//         model,
//         created_at
//       FROM washing_job_cards 
//       ORDER BY created_at DESC
//     `;
//     const [jobs] = await db.query(sql);

//     res.status(200).json({
//       success: true,
//       count: jobs.length,
//       data: jobs,
//     });
//   } catch (err) {
//     console.error('Error fetching washing jobs:', err);
//     res.status(500).json({ success: false, message: 'Server Error' });
//   }
// };

// /**
//  * @desc    Get a single washing job by ID
//  * @route   GET /api/washing-jobs/:id
//  */
// const getWashingJobById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const sql = `SELECT * FROM washing_job_cards WHERE id = ?`;
//     const [rows] = await db.query(sql, [id]);
    
//     if (rows.length === 0) {
//       return res.status(404).json({ success: false, message: 'Washing Job not found' });
//     }
    
//     return res.status(200).json({ success: true, data: rows[0] });
//   } catch (err) {
//     console.error('Error fetching washing job by id:', err);
//     return res.status(500).json({ success: false, message: 'Server Error' });
//   }
// };

// /**
//  * @desc    Update a washing job (Dynamic Update)
//  * @route   PUT /api/washing-jobs/:id
//  */
// const updateWashingJob = async (req, res) => {
//   const { id } = req.params;
//   const updates = req.body || {};

//   console.log('[updateWashingJob] Request:', { id, updates });

//   // List of columns that exist in your database table
//   const allowedColumns = [
//     'vehicle_no', 'make', 'model', 'customer_name', 'email', 'customer_voice', 
//     'mobile_number', 'status', 'delivery_date', 'delivery_time', 'user_id', 
//     'labour_charge', 'advance_amount', 'bill_amount', 'completion_datetime', 
//     'exit_datetime', 'remind_period'
//   ];

//   const setParts = [];
//   const values = [];

//   // Iterate over allowed columns and check if they exist in the request body
//   for (const key of allowedColumns) {
//     if (Object.prototype.hasOwnProperty.call(updates, key) && updates[key] !== undefined) {
//       setParts.push(`${key} = ?`);
//       values.push(updates[key]);
//     }
//   }

//   if (setParts.length === 0) {
//     return res.status(400).json({ success: false, message: 'No valid fields provided for update.' });
//   }

//   try {
//     // Add updated_at timestamp automatically
//     setParts.push(`updated_at = NOW()`);

//     const sql = `UPDATE washing_job_cards SET ${setParts.join(', ')} WHERE id = ?`;
//     values.push(id);

//     const [result] = await db.query(sql, values);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ success: false, message: 'Washing job not found.' });
//     }

//     return res.status(200).json({ success: true, message: 'Washing job updated successfully.' });
//   } catch (err) {
//     console.error('Error updating washing job:', err);
//     return res.status(500).json({ success: false, message: 'Update failed.', error: err.message });
//   }
// };

// /**
//  * @desc    Quick update status of a washing job
//  * @route   PUT /api/washing-jobs/:id/status
//  */
// const updateWashingJobStatus = async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   // Validate status against DB ENUM values
//   const allowedStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
//   if (!status || !allowedStatuses.includes(status)) {
//     return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` });
//   }

//   if (!status) {
//     return res.status(400).json({ success: false, message: 'Status is required.' });
//   }

//   try {
//     const sql = 'UPDATE washing_job_cards SET status = ?, updated_at = NOW() WHERE id = ?';
//     const [result] = await db.query(sql, [status, id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ success: false, message: 'Washing job not found.' });
//     }

//     res.status(200).json({
//       success: true,
//       message: `Washing job status updated to ${status}.`,
//     });
//   } catch (err) {
//     console.error('Error updating status:', err);
//     res.status(500).json({ success: false, message: 'Server Error' });
//   }
// };

// module.exports = {
//   createWashingJob,
//   getAllWashingJobs,
//   getWashingJobById,
//   updateWashingJob,
//   updateWashingJobStatus
// };





const db = require('../config/db');

/**
 * @desc    Create a new washing job
 * @route   POST /api/washing-jobs
 */
const createWashingJob = async (req, res) => {
  const { 
    vehicle_no, make, model, customer_name, mobile_number, 
    email, customer_voice,
    delivery_date, delivery_time, user_id, garage_name,
    advance_amount, bill_amount,
    completion_datetime, exit_datetime, remind_period, items 
  } = req.body;

  if (!vehicle_no || !make || !customer_name || !mobile_number) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide required fields: vehicle_no, make, customer_name, and mobile_number.' 
    });
  }

  try {
    const sql = `
      INSERT INTO washing_job_cards (
        vehicle_no, make, model, customer_name, mobile_number, email, customer_voice,
        status, delivery_date, delivery_time,
        user_id, garage_name,
        advance_amount, bill_amount,
        completion_datetime, exit_datetime, remind_period,
        created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const values = [
      vehicle_no,
      make,
      model,
      customer_name,
      mobile_number,
      email || null,
      customer_voice || null,

      'pending',
      delivery_date || null,
      delivery_time || null,

      Number(user_id) || null,
      garage_name || null,

      advance_amount || 0,
      bill_amount || 0,

      completion_datetime || null,
      exit_datetime || null,
      remind_period || null
    ];

    const [result] = await db.query(sql, values);

    res.status(201).json({
      success: true,
      message: 'New washing job created successfully!',
      jobId: result.insertId,
    });

  } catch (err) {
    console.error('Error creating washing job:', err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
};

/**
 * @desc Get all washing jobs
 */
const getAllWashingJobs = async (req, res) => {
  try {
    const sql = `
    
      SELECT 
        id, 
        CONCAT('MCW-', YEAR(created_at), '-', id) AS srNo,
        customer_name AS customerName,
        vehicle_no AS vehicleNumber,
        mobile_number AS mobileNumber,
        status,
        make,
        model,
        created_at
      FROM washing_job_cards
      ORDER BY created_at DESC
    `;

    const [jobs] = await db.query(sql);

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (err) {
    console.error('Error fetching washing jobs:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * @desc Get single washing job
 */
const getWashingJobById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT * FROM washing_job_cards WHERE id = ?`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Washing Job not found' });
    }

    // Fetch items associated with this washing job
    const [items] = await db.query(
      `SELECT id as item_id, item_name, quantity, price, total, type FROM washing_job_items WHERE washing_job_id = ?`,
      [id]
    );

    const job = rows[0];
    job.items = items || [];

    res.status(200).json({ success: true, data: job });
  } catch (err) {
    console.error('Error fetching washing job:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * @desc Update washing job
 */
const updateWashingJob = async (req, res) => {
  const { id } = req.params;
  const updates = req.body || {};

  const allowedColumns = [
    'vehicle_no', 'make', 'model', 'customer_name',
    'email', 'customer_voice', 'mobile_number',
    'status', 'delivery_date', 'delivery_time',
    'user_id', 'garage_name',
    'advance_amount', 'bill_amount',
    'completion_datetime', 'exit_datetime',
    'remind_period'
  ];

  const setParts = [];
  const values = [];

  for (const key of allowedColumns) {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      setParts.push(`${key} = ?`);
      
      let value = updates[key];
      // Fix: Convert empty string to null for user_id (Integer column) to prevent DB error
      if (key === 'user_id' && value === '') {
        value = null;
      }
      values.push(value);
    }
  }

  if (!setParts.length) {
    return res.status(400).json({ success: false, message: 'No valid fields provided.' });
  }

  setParts.push(`updated_at = NOW()`);

  try {
    const sql = `UPDATE washing_job_cards SET ${setParts.join(', ')} WHERE id = ?`;
    values.push(id);

    const [result] = await db.query(sql, values);

    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: 'Washing job not found.' });
    }

    // --- Update Items (Delete & Re-insert) ---
    if (updates.items && Array.isArray(updates.items)) {
      // Ensure table exists
      await db.query(`
        CREATE TABLE IF NOT EXISTS washing_job_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          washing_job_id INT NOT NULL,
          item_name VARCHAR(255),
          quantity DECIMAL(10,2) DEFAULT 0,
          price DECIMAL(10,2) DEFAULT 0,
          total DECIMAL(10,2) DEFAULT 0,
          type VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Delete old items
      await db.query(`DELETE FROM washing_job_items WHERE washing_job_id = ?`, [id]);

      // Insert new items
      if (updates.items.length > 0) {
        const itemValues = updates.items.map(item => [
          id,
          item.item_name || item.name,
          item.quantity || 0,
          item.price || 0,
          item.total || 0,
          item.type || 'job'
        ]);
        
        const sqlItems = `INSERT INTO washing_job_items (washing_job_id, item_name, quantity, price, total, type) VALUES ?`;
        await db.query(sqlItems, [itemValues]);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Washing job updated successfully.'
    });
  } catch (err) {
    console.error('Error updating washing job:', err);
    res.status(500).json({ success: false, message: 'Update failed.', error: err.message });
  }
};

/**
 * @desc Update washing job status
 */
const updateWashingJobStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];

  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}`
    });
  }

  try {
    const [result] = await db.query(
      `UPDATE washing_job_cards SET status = ?, updated_at = NOW() WHERE id = ?`,
      [status, id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: 'Washing job not found.' });
    }

    res.status(200).json({
      success: true,
      message: `Washing job status updated to ${status}`
    });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * @desc    Get washing job counts grouped by status
 * @route   GET /api/washing-jobs/stats/status-counts
 */
const getWashingJobStatusCounts = async (req, res) => {
  try {
    const sql = `
      SELECT 
        status, 
        COUNT(*) as count 
      FROM washing_job_cards 
      WHERE status IN ('pending', 'completed', 'closed') 
      GROUP BY status;
    `;
    const [results] = await db.query(sql);

    // Initialize counts to ensure all statuses are present in the response
    const statusCounts = {
      pending: 0,
      completed: 0,
      closed: 0,
    };

    // Populate counts from the database results
    results.forEach(row => {
      if (statusCounts.hasOwnProperty(row.status)) {
        statusCounts[row.status] = row.count;
      }
    });

    res.status(200).json({
      success: true,
      data: statusCounts,
    });
  } catch (err) {
    console.error('Error fetching washing job status counts:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  createWashingJob,
  getAllWashingJobs,
  getWashingJobById,
  updateWashingJob,
  updateWashingJobStatus,
  getWashingJobStatusCounts,
};
