const db = require('../config/db');
const exceljs = require('exceljs');


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

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job card",
    });
  }
};





// Helper function to build the report query
const buildReportQuery = (filters) => {
  const { customerName, vehicleNumber, mobileNumber, duration } = filters;

  // Select directly from the 'jobcards' table. 
  // The columns 'vehicle_no', 'customer_name', and 'mobile_number' exist on this table.
  let sql = `
    SELECT 
      id, 
      status, 
      estimate, 
      created_at,
      vehicle_no, 
      customer_name, 
      mobile_number
    FROM jobcards
    WHERE 1=1
  `;
  const params = [];

  if (customerName) {
    // Filter by the 'customer_name' column
    sql += " AND customer_name LIKE ?";
    params.push(`%${customerName}%`);
  }
  if (vehicleNumber) {
    // Filter by the 'vehicle_no' column
    sql += " AND vehicle_no LIKE ?";
    params.push(`%${vehicleNumber}%`);
  }
  if (mobileNumber) {
    // Filter by the 'mobile_number' column
    sql += " AND mobile_number LIKE ?";
    params.push(`%${mobileNumber}%`);
  }
  // if (duration) {
  //   const [startDateStr, endDateStr] = duration.split(' - ');
  //   if (startDateStr && endDateStr) {
  //     // Assuming the date format is MM/DD/YYYY from the frontend
  //     const [startMonth, startDay, startYear] = startDateStr.split('/');
  //     const [endMonth, endDay, endYear] = endDateStr.split('/');
  //     const sqlStartDate = `${startYear}-${startMonth}-${startDay} 00:00:00`;
  //     const sqlEndDate = `${endYear}-${endMonth}-${endDay} 23:59:59`;
  //     // Filter by the 'created_at' column for the date range
  //     sql += " AND created_at BETWEEN ? AND ?";
  //     params.push(sqlStartDate, sqlEndDate);
  //   }
  // }
  if (
  duration &&
  duration.includes(' - ') &&
  duration.split(' - ').length === 2
) {
  const [startDateStr, endDateStr] = duration.split(' - ');

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (!isNaN(startDate) && !isNaN(endDate)) {
    sql += " AND DATE(created_at) BETWEEN ? AND ?";
    params.push(
      startDate.toISOString().slice(0, 10),
      endDate.toISOString().slice(0, 10)
    );
  }
}


  sql += " ORDER BY created_at DESC";
  
  return { sql, params };
};

/**
 * @desc    Search for job cards based on customer, vehicle, or mobile
 * @route   POST /api/reports/search
 */
const searchJobCards = async (req, res) => {

  console.log("SEARCH API HIT");
  console.log("REQ BODY:", req.body);

  try {
    const { sql, params } = buildReportQuery(req.body);
    // For debugging, log the generated SQL and params
    // console.log('Executing SQL:', sql);
    // console.log('With Params:', params);

    const [results] = await db.query(sql, params);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });

  } catch (err) {
    // Log the detailed error to the server console
    console.error('SQL Error in searchJobCards:', err.message); 
    
    // Send a more informative error response
    res.status(500).json({ 
      success: false, 
      message: 'A database error occurred during the search.',
      // In a development environment, you can send back the specific error
      error: process.env.NODE_ENV !== 'production' ? err.message : undefined
    });
  }
};

/**
 * @desc    Download an Excel report based on filters
 * @route   POST /api/reports/download
 */
const downloadExcelReport = async (req, res) => {
  try {
    const { sql, params } = buildReportQuery(req.body);
    const [results] = await db.query(sql, params);

    if (results.length === 0) {
      // It's better to send a message than an empty file
      return res.status(404).json({
        success: false,
        message: "No records found matching the criteria to generate a report."
      });
    }

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Job Card Report');

    worksheet.columns = [
      { header: 'Job ID', key: 'id', width: 10 },
      { header: 'Date', key: 'created_at', width: 20 },
      { header: 'Customer Name', key: 'customer_name', width: 30 },
      { header: 'Vehicle No', key: 'vehicle_no', width: 20 },
      { header: 'Mobile Number', key: 'mobile_number', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Estimate', key: 'estimate', width: 15, style: { numFmt: '"Rs." #,##0.00' } }
    ];

    results.forEach(job => {
      worksheet.addRow({
        id: `MC-${job.id}`,
        created_at: new Date(job.created_at),
        customer_name: job.customer_name,
        vehicle_no: job.vehicle_no,
        mobile_number: job.mobile_number,
        status: job.status,
        estimate: parseFloat(job.estimate)
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="JobCardReport.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    // Log the detailed error to the server console
    console.error('SQL Error in downloadExcelReport:', err.message);
    
    // We can't send a JSON response if we've already started sending a file,
    // but the error will be logged on the server.
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        message: 'A database error occurred while generating the report.',
        error: process.env.NODE_ENV !== 'production' ? err.message : undefined
      });
    }
  }
};

module.exports = {
  searchJobCards,
  downloadExcelReport,
   getJobCardById
};
