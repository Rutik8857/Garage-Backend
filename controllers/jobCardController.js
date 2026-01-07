const db = require('../config/db');
const ExcelJS = require('exceljs');

// Helper function to format date strings to 'YYYY-MM-DD' for DATE columns
const formatDate = (dateString) => {
  if (!dateString) return null;
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
};

// ---------------- GET ALL JOBCARDS (JSON for UI) ----------------
const getAllJobCards = async (req, res) => {
  try {
    // 1. Pagination and Filter Params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const offset = (page - 1) * limit;
    const status = req.query.status; // e.g., 'pending', 'completed'

    // 2. Build Query based on filter
    let countSql = 'SELECT COUNT(*) as total FROM jobcards';
    let dataSql = 'SELECT * FROM jobcards';
    const queryParams = [];

    if (status) {
      countSql += ' WHERE status = ?';
      dataSql += ' WHERE status = ?';
      queryParams.push(status);
    }

    // 3. Fetch Total Count for the filtered data
    const [countResult] = await db.query(countSql, queryParams);
    const totalRecords = countResult[0].total;
    const totalPages = Math.ceil(totalRecords / limit);

    // 4. Fetch Paginated Data
    dataSql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const dataParams = [...queryParams, limit, offset];
    const [results] = await db.query(dataSql, dataParams);
    
    res.status(200).json({ 
      success: true, 
      data: results,
      pagination: {
        totalRecords,
        currentPage: page,
        totalPages,
        limit
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Database query failed.',
    });
  }
};

// ---------------- CREATE JOBCARD ----------------
const createJobCard = async (req, res) => {
  const {
    vehicleNo,
    make,
    model,
    runningKm,
    customerName,
    mobileNumber,
    estimate,
    serviceOption,
    customerVoice,
    deliveryDate,
    deliveryTime,

    reminder1,  // <--- Receive these from frontend
    reminder2,
    completionDateTime,
    items, // <--- Receive items array
    advanceAmount, // <--- Receive Advance Amount
    discountAmount // <--- Receive Discount Amount
  } = req.body;

  if (!vehicleNo || !make || !runningKm || !customerName || !mobileNumber) {
    return res.status(400).json({
      success: false,
      message:
        'Please fill all required fields: vehicle number, make, running km, customer name, and mobile number.',
    });
  }

  try {
    const sanitizedEstimate = (estimate === '' || estimate === undefined) ? 0 : estimate;
    const sanitizedRunningKM = (runningKm === '' || runningKm === undefined) ? 0 : runningKm;

    const newJobCard = {
      vehicle_no: vehicleNo,
      make: make,
      model: model,
      running_km: sanitizedRunningKM,
      customer_name: customerName,
      mobile_number: mobileNumber,
      select_option: serviceOption,
      estimate: sanitizedEstimate,
      customer_voice: customerVoice,
      status: 'pending',
      // delivery_date: deliveryDate || null,
      // delivery_time: deliveryTime || null,

      delivery_date: formatDate(deliveryDate),
      delivery_time: deliveryTime || null,
      reminder_1: formatDate(reminder1), // Assuming 'remind_period' is your DB column for Reminder 1
      // If you have a second column for reminder 2, map it here:
      reminder_2: formatDate(reminder2), 
      
      completion_datetime: completionDateTime || null,
      advance_amount: advanceAmount || 0,
      discount_amount: discountAmount || 0,
    };

    const sql = 'INSERT INTO jobcards SET ?';
    const [result] = await db.query(sql, [newJobCard]);
    const jobCardId = result.insertId;

    // Insert into customers if not exists
    const customerSql = `
      INSERT INTO customers (mobile_number, customer_name, address)
      VALUES (?, ?, '')
      ON DUPLICATE KEY UPDATE customer_name = VALUES(customer_name)
    `;
    await db.query(customerSql, [mobileNumber, customerName]);

    // Insert into quotations
    const quotationSql = `
      INSERT INTO quotations (jobcard_id, total_amount, quotation_date, vehicle_number)
      VALUES (?, 0, NOW(), ?)
    `;
    await db.query(quotationSql, [jobCardId, vehicleNo]);

    // --- Insert Items into jobcard_items ---
    if (items && Array.isArray(items) && items.length > 0) {
      const itemValues = items.map(item => {
        // FIX: Read 'needQty' from frontend payload, along with other fallbacks.
        const qty = Number(item.needQty || item.qty || item.quantity || 1);
        const rate = Number(item.price || item.rate || 0);
        const amount = qty * rate;
        return [
          jobCardId,
          item.name || item.product_name || item.item_name || 'Unknown Item',
          qty,
          rate,
          amount,
          item.type || 'job'
        ];
      });
      const itemSql = 'INSERT INTO jobcard_items (jobcard_id, item_name, quantity, rate, amount, type) VALUES ?';
      try {
        await db.query(itemSql, [itemValues]);
      } catch (err) {
        if (err.code === 'ER_NO_SUCH_TABLE') {
          console.log("Table 'jobcard_items' missing. Creating it...");
          await db.query(`
            CREATE TABLE IF NOT EXISTS jobcard_items (
              id INT AUTO_INCREMENT PRIMARY KEY,
              jobcard_id INT NOT NULL,
              item_name VARCHAR(255),
              quantity DECIMAL(10,2) DEFAULT 0,
              rate DECIMAL(10,2) DEFAULT 0,
              amount DECIMAL(10,2) DEFAULT 0,
              type VARCHAR(50) DEFAULT 'job',
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
          `);
          await db.query(itemSql, [itemValues]);
        } else {
          throw err;
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Job card created successfully!',
      jobCardId: result.insertId,
    });
  } catch (err) {
    console.error('Error creating job card:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to create job card.',
      error: err.message,
      sqlMessage: err.sqlMessage
    });
  }
};

// ---------------- UPDATE STATUS ----------------
const updateJobCardStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Status is required',
    });
  }

  try {
    await db.query(
      'UPDATE jobcards SET status = ? WHERE id = ?',
      [status, id]
    );

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
    });
  }
};

// ---------------- DOWNLOAD EXCEL ----------------
const downloadJobcardsExcel = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM jobcards ORDER BY created_at DESC'
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Job Cards');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Vehicle No', key: 'vehicle_no', width: 15 },
      { header: 'Make', key: 'make', width: 15 },
      { header: 'Model', key: 'model', width: 15 },
      { header: 'Running KM', key: 'running_km', width: 15 },
      { header: 'Customer Name', key: 'customer_name', width: 20 },
      { header: 'Mobile Number', key: 'mobile_number', width: 15 },
      { header: 'Service Option', key: 'select_option', width: 15 },
      { header: 'Estimate', key: 'estimate', width: 12 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Created At', key: 'created_at', width: 20 },
    ];

    rows.forEach((row) => {
      worksheet.addRow(row);
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=jobcards.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Excel download failed',
    });
  }
};

// GET jobcard by ID
const getJobCardById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM jobcards WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job card not found",
      });
    }

    const data = rows[0];

    // Fetch associated items for the job card
    let items = [];
    try {
      const [itemRows] = await db.query(
        "SELECT * FROM jobcard_items WHERE jobcard_id = ?",
        [id]
      );
      items = itemRows;
    } catch (itemError) {
      console.warn("Warning: Could not fetch jobcard_items (Table might be missing):", itemError.message);
    }

    const formattedData = {
      id: data.id,
      vehicleNo: data.vehicle_no,
      make: data.make,
      model: data.model,
      runningKm: data.running_km,
      customerName: data.customer_name,
      mobileNumber: data.mobile_number,
      serviceOption: data.select_option,
      estimate: data.estimate,
      customerVoice: data.customer_voice,
      status: data.status,
      created_at: data.created_at,
      deliveryDate: data.delivery_date,
      deliveryTime: data.delivery_time,
      completionDateTime: data.completion_datetime,
      reminder1: data.reminder_1,
      reminder2: data.reminder_2,
      advanceAmount: data.advance_amount,
      discountAmount: data.discount_amount,
      billAmount: data.bill_amount,
      balanceAmount: data.balance_amount,
      // --- NEW: Add item arrays to the response, which the modal expects ---
      jobs: items.filter(item => item.type === 'job'),
      oils: items.filter(item => item.type === 'oil'),
      spares: items.filter(item => item.type === 'spare'),
    };

    res.json({
      success: true,
      data: formattedData,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job card",
    });
  }
};


// ---------------- DELETE JOBCARD ----------------
const deleteJobCard = async (req, res) => {
  const { id } = req.params;

  try {
    // Execute the delete query
    const [result] = await db.query('DELETE FROM jobcards WHERE id = ?', [id]);

    // Check if any row was actually deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Job card not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job card deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting job card:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job card.',
    });
  }
};
const updateJobCard = async (req, res) => {
  const { id } = req.params;

  const {
    vehicleNo,
    make,
    model,
    runningKm,
    customerName,
    mobileNumber,
    estimate,
    serviceOption,
    customerVoice,
    status,
    deliveryDate,
    deliveryTime,
    completionDateTime,
    reminder1,
    reminder2,
    mechanic, reminderMonth, items, // <--- Receive items array
    labourCharge, sparepartCharge, oilCharge,
    advanceAmount, discountAmount, billAmount, balanceAmount
  } = req.body;

  try {
    const sanitizedEstimate =
      estimate === '' || estimate === undefined ? 0 : estimate;

    const sanitizedRunningKM =
      runningKm === '' || runningKm === undefined ? 0 : runningKm;

    const sql = `
      UPDATE jobcards
      SET
        vehicle_no = ?,
        make = ?,
        model = ?,
        running_km = ?,
        customer_name = ?,
        mobile_number = ?,
        estimate = ?,
        select_option = ?,
        customer_voice = ?,
        status = ?,
        delivery_date = ?,
        delivery_time = ?,
        completion_datetime = ?,
        reminder_1 = ?,
        reminder_2 = ?,
        mechanic = ?,
        reminder_month = ?,
        labour_charge = ?,
        sparepart_charge = ?,
        oil_charge = ?,
        advance_amount = ?,
        discount_amount = ?,
        bill_amount = ?,
        balance_amount = ?
      WHERE id = ?
    `;

    const values = [
      vehicleNo,
      make,
      model,
      sanitizedRunningKM,
      customerName,
      mobileNumber,
      sanitizedEstimate,
      serviceOption,
      customerVoice,
      status,
      formatDate(deliveryDate),
      deliveryTime || null,
      completionDateTime || null,
      formatDate(reminder1),
      formatDate(reminder2),
      mechanic || null, 
      reminderMonth || null,
      labourCharge || 0,
      sparepartCharge || 0,
      oilCharge || 0,
      advanceAmount || 0, 
      discountAmount || 0, 
      billAmount || 0,
      balanceAmount || 0,
      id
    ];

    await db.query(sql, values);

    // --- Update Items (Delete & Re-insert) ---
    if (items && Array.isArray(items)) {
      try {
        await db.query('DELETE FROM jobcard_items WHERE jobcard_id = ?', [id]);
      } catch (err) {
        // Ignore table missing error during delete, we will create it during insert if needed
        if (err.code !== 'ER_NO_SUCH_TABLE') throw err;
      }
      
      if (items.length > 0) {
        const itemValues = items.map(item => {
          // FIX: Read 'needQty' from frontend payload, along with other fallbacks.
          const qty = Number(item.needQty || item.qty || item.quantity || 1);
          const rate = Number(item.price || item.rate || 0);
          const amount = qty * rate;
          return [
            id,
            item.name || item.product_name || item.item_name || 'Unknown Item',
            qty,
            rate,
            amount,
            item.type || 'job'
          ];
        });
        const itemSql = 'INSERT INTO jobcard_items (jobcard_id, item_name, quantity, rate, amount, type) VALUES ?';
        try {
          await db.query(itemSql, [itemValues]);
        } catch (err) {
          if (err.code === 'ER_NO_SUCH_TABLE') {
            await db.query(`
              CREATE TABLE IF NOT EXISTS jobcard_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                jobcard_id INT NOT NULL,
                item_name VARCHAR(255),
                quantity DECIMAL(10,2) DEFAULT 0,
                rate DECIMAL(10,2) DEFAULT 0,
                amount DECIMAL(10,2) DEFAULT 0,
                type VARCHAR(50) DEFAULT 'job',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              )
            `);
            await db.query(itemSql, [itemValues]);
          } else {
            throw err;
          }
        }
      }
    }

    

    // ✅ customer table sync
    if (mobileNumber && customerName) {
      const customerSql = `
        INSERT INTO customers (mobile_number, customer_name, address)
        VALUES (?, ?, '')
        ON DUPLICATE KEY UPDATE customer_name = VALUES(customer_name)
      `;
      await db.query(customerSql, [mobileNumber, customerName]);
    }

    // ✅ quotation sync
    if (estimate !== undefined) {
      const [existingQuotation] = await db.query(
        'SELECT id FROM quotations WHERE jobcard_id = ?',
        [id]
      );

      if (existingQuotation.length === 0) {
        await db.query(
          `INSERT INTO quotations (jobcard_id, total_amount, quotation_date)
           VALUES (?, ?, NOW())`,
          [id, sanitizedEstimate]
        );
      } else {
        await db.query(
          `UPDATE quotations SET total_amount = ? WHERE jobcard_id = ?`,
          [sanitizedEstimate, id]
        );
      }
    }

    res.json({ success: true, message: 'Job card updated successfully' });

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, message: 'Database Error' });
  }
};


//update part 





module.exports = {
  getAllJobCards,
  createJobCard,
  updateJobCardStatus,
  downloadJobcardsExcel,
  getJobCardById,
  deleteJobCard,
  updateJobCard,
};
