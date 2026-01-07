// const db = require('../config/db');

// exports.getDashboardStats = async (req, res) => {
//   try {
//     // Execute all queries in parallel for better performance
//     const [
//       [[jobCards]],
//       [[washingJobs]],
//       [[customers]],
//       [[stock]]
//     ] = await Promise.all([
//       db.query(`SELECT COUNT(*) AS total FROM job_cards`),
//       db.query(`SELECT COUNT(*) AS total FROM washing_job_cards`),
//       db.query(`SELECT COUNT(*) AS total FROM customers`),
//       db.query(`SELECT COUNT(*) AS total FROM inventory`)
//     ]);

//     res.json({
//       success: true,
//       data: {
//         jobCards: jobCards?.total || 0,
//         washingJobs: washingJobs?.total || 0,
//         customers: customers?.total || 0,
//         stock: stock?.total || 0,
//       },
//     });
//   } catch (error) {
//     console.error("Dashboard stats error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch dashboard stats",
//     });
//   }
// };

// exports.getJobCardStatusStats = async (req, res) => {
//   try {
//     const sql = `
//       SELECT
//         status,
//         COUNT(*) AS count
//       FROM
//         jobcards
//       WHERE
//         status IN ('pending', 'completed', 'closed')
//       GROUP BY
//         status;
//     `;
//     const [results] = await db.query(sql);

//     // Initialize counts to ensure all statuses are present in the response
//     const statusCounts = {
//       pending: 0,
//       completed: 0,
//       closed: 0,
//     };

//     // Populate counts from the database results
//     results.forEach(row => {
//       if (statusCounts.hasOwnProperty(row.status)) {
//         statusCounts[row.status] = row.count;
//       }
//     });

//     res.status(200).json({
//       success: true,
//       data: statusCounts,
//     });
//   } catch (error) {
//     console.error("Job Card Status Stats error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch job card status stats",
//     });
//   }
// };



// const db = require('../config/db');

// exports.getDashboardStats = async (req, res) => {
//   try {
//     const [
//       [[jobCards]],
//       [[washingJobs]],
//       [[customers]],
//       [[stock]]
//     ] = await Promise.all([
//       db.query(`SELECT COUNT(*) AS total FROM jobcards`),
//       db.query(`SELECT COUNT(*) AS total FROM washing_job_cards`),
//       db.query(`SELECT COUNT(*) AS total FROM customers`),
//       db.query(`SELECT COUNT(*) AS total FROM inventory`)
//     ]);

//     res.json({
//       success: true,
//       data: {
//         jobCards: jobCards?.total || 0,
//         washingJobs: washingJobs?.total || 0,
//         customers: customers?.total || 0,
//         stock: stock?.total || 0
//       }
//     });
//   } catch (error) {
//     console.error("Dashboard stats error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch dashboard stats"
//     });
//   }
// };


// exports.getJobCardStatusStats = async (req, res) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT status, COUNT(*) AS count
//       FROM jobcards
//       WHERE status IN ('pending', 'completed', 'closed')
//       GROUP BY status
//     `);

//     // ensure all statuses exist
//     const result = {
//       pending: 0,
//       completed: 0,
//       closed: 0
//     };

//     rows.forEach(r => {
//       result[r.status] = r.count;
//     });

//     res.status(200).json({
//       success: true,
//       data: result
//     });

//   } catch (error) {
//     console.error("Job card status error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch job card status"
//     });
//   }
// };




// const db = require('../config/db');

// exports.getDashboardStats = async (req, res) => {
//   try {
//     const [
//       jobCardsRes,
//       washingJobsRes,
//       customersRes,
//       stockRes
//     ] = await Promise.all([
//       // ✅ FIX: Changed 'job_cards' back to 'jobcards' (Check your DB table name!)
//       db.query(`SELECT COUNT(*) AS total FROM jobcards`),         
//       db.query(`SELECT COUNT(*) AS total FROM washing_job_cards`),
//       db.query(`SELECT COUNT(*) AS total FROM customers`),
//       db.query(`SELECT COUNT(*) AS total FROM inventory`)
//     ]);

//     const data = {
//       jobCards: jobCardsRes[0][0]?.total || 0,
//       washingJobs: washingJobsRes[0][0]?.total || 0,
//       customers: customersRes[0][0]?.total || 0,
//       stock: stockRes[0][0]?.total || 0
//     };

//     res.json({ success: true, data: data });

//   } catch (error) {
//     // 🔍 This log will show you the REAL error in your VS Code Terminal
//     console.error("❌ Dashboard Stats Error:", error.sqlMessage || error.message);
//     res.status(500).json({ success: false, message: "Server Error", error: error.message });
//   }
// };

// exports.getJobCardStatusStats = async (req, res) => {
//   try {
//     // ✅ FIX: Changed 'job_cards' back to 'jobcards'
//     const [rows] = await db.query(`
//       SELECT status, COUNT(*) AS count
//       FROM jobcards
//       GROUP BY status
//     `);

//     const result = { pending: 0, completed: 0, closed: 0 };

//     rows.forEach(r => {
//       // Handle case sensitivity (Pending vs pending)
//       const key = r.status ? r.status.toLowerCase() : 'unknown';
//       if (key === 'open') result.pending += r.count; // Map 'open' to 'pending'
//       else if (result.hasOwnProperty(key)) result[key] += r.count;
//     });

//     res.status(200).json({ success: true, data: result });

//   } catch (error) {
//     console.error("❌ Status Stats Error:", error.sqlMessage || error.message);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// exports.getMonthlyRevenue = async (req, res) => {
//   try {
//     // 1. Generate the last 6 months keys (YYYY-MM) and names (Jan, Feb...)
//     const months = [];
//     for (let i = 5; i >= 0; i--) {
//       const d = new Date();
//       d.setMonth(d.getMonth() - i);
//       const year = d.getFullYear();
//       const month = String(d.getMonth() + 1).padStart(2, '0');
//       const monthName = d.toLocaleString('default', { month: 'short' });
//       months.push({ key: `${year}-${month}`, name: monthName, revenue: 0 });
//     }

//     // 2. Calculate start date for query (first day of the 6th month ago)
//     const startDate = `${months[0].key}-01`;

//     // 3. Query Job Cards (using 'estimate' as revenue)
//     const [jobRows] = await db.query(`
//       SELECT DATE_FORMAT(created_at, '%Y-%m') as month_key, SUM(estimate) as total
//       FROM jobcards
//       WHERE created_at >= ?
//       GROUP BY month_key
//     `, [startDate]);

//     // 4. Query Washing Jobs (using 'bill_amount' as revenue)
//     const [washingRows] = await db.query(`
//       SELECT DATE_FORMAT(created_at, '%Y-%m') as month_key, SUM(bill_amount) as total
//       FROM washing_job_cards
//       WHERE created_at >= ?
//       GROUP BY month_key
//     `, [startDate]);

//     // 5. Aggregate data
//     const revenueMap = {};
    
//     // Populate map with DB results
//     jobRows.forEach(r => {
//       revenueMap[r.month_key] = (revenueMap[r.month_key] || 0) + (Number(r.total) || 0);
//     });
//     washingRows.forEach(r => {
//       revenueMap[r.month_key] = (revenueMap[r.month_key] || 0) + (Number(r.total) || 0);
//     });

//     // 6. Map to final array ensuring all 6 months are present
//     const finalData = months.map(m => ({
//       name: m.name,
//       revenue: revenueMap[m.key] || 0
//     }));

//     res.json({ success: true, data: finalData });
//   } catch (error) {
//     console.error("Monthly revenue error:", error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };






// const db = require('../config/db');

// /**
//  * @desc    Get counts for Dashboard Cards (Job Cards, Washing, Customers, Stock)
//  * @route   GET /api/dashboard/stats
//  */
// exports.getDashboardStats = async (req, res) => {
//   try {
//     // Execute all count queries in parallel for performance
//     const [
//       jobCardsRes,
//       washingJobsRes,
//       customersRes,
//       stockRes
//     ] = await Promise.all([
//       db.query(`SELECT COUNT(*) AS total FROM jobcards`),
//       db.query(`SELECT COUNT(*) AS total FROM washing_job_cards`),
//       db.query(`SELECT COUNT(*) AS total FROM customers`),
//       db.query(`SELECT COUNT(*) AS total FROM inventory`) // Check if your table is 'inventory' or 'items'
//     ]);

//     // Extract values safely (handles different mysql2 versions)
//     const data = {
//       jobCards: jobCardsRes[0][0]?.total || 0,
//       washingJobs: washingJobsRes[0][0]?.total || 0,
//       customers: customersRes[0][0]?.total || 0,
//       stock: stockRes[0][0]?.total || 0
//     };

//     res.json({ success: true, data: data });

//   } catch (error) {
//     console.error("❌ Dashboard Stats Error:", error.sqlMessage || error.message);
//     res.status(500).json({ success: false, message: "Server Error", error: error.message });
//   }
// };

// /**
//  * @desc    Get Pie Chart Data (Pending vs Completed vs Closed)
//  * @route   GET /api/dashboard/jobcard-status
//  */
// exports.getJobCardStatusStats = async (req, res) => {
//   try {
//     // Group by status to get counts
//     const [rows] = await db.query(`
//       SELECT status, COUNT(*) AS count
//       FROM jobcards
//       GROUP BY status
//     `);

//     // Initialize default structure
//     const result = { pending: 0, completed: 0, closed: 0 };

//     rows.forEach(r => {
//       // Normalize string to lowercase
//       const key = r.status ? r.status.toLowerCase() : 'unknown';
      
//       // Logic: Map 'open' to 'pending', otherwise use exact match
//       if (key === 'open' || key === 'pending') {
//         result.pending += r.count;
//       } else if (result.hasOwnProperty(key)) {
//         result[key] += r.count;
//       }
//     });

//     res.status(200).json({ success: true, data: result });

//   } catch (error) {
//     console.error("❌ Status Stats Error:", error.sqlMessage || error.message);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// /**
//  * @desc    Get Bar Chart Data (Revenue) with Filtering
//  * @route   GET /api/dashboard/monthly-revenue?filter=...
//  */
// exports.getMonthlyRevenue = async (req, res) => {
//   try {
//     const filter = req.query.filter || '6_months';
//     let startDate, endDate;
//     const monthsTemplate = [];

//     const now = new Date();
//     const currentYear = now.getFullYear();

//     // --- 1. Generate Date Ranges & Template ---
//     if (filter === 'this_year') {
//       startDate = `${currentYear}-01-01`;
//       endDate = `${currentYear}-12-31`;
      
//       // Generate Jan to Dec
//       for (let i = 0; i < 12; i++) {
//         const d = new Date(currentYear, i, 1);
//         const key = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
//         const name = d.toLocaleString('default', { month: 'short' });
//         monthsTemplate.push({ key, name, revenue: 0 });
//       }

//     } else if (filter === 'last_year') {
//       const lastYear = currentYear - 1;
//       startDate = `${lastYear}-01-01`;
//       endDate = `${lastYear}-12-31`;

//       for (let i = 0; i < 12; i++) {
//         const d = new Date(lastYear, i, 1);
//         const key = `${lastYear}-${String(i + 1).padStart(2, '0')}`;
//         const name = d.toLocaleString('default', { month: 'short' });
//         monthsTemplate.push({ key, name, revenue: 0 });
//       }

//     } else {
//       // Default: Last 6 Months
//       // Go back 5 months from now
//       const d = new Date();
//       d.setMonth(d.getMonth() - 5);
//       d.setDate(1); // Start of that month
      
//       startDate = d.toISOString().split('T')[0];
//       endDate = new Date().toISOString().split('T')[0]; // Today

//       // Generate loop for 6 months
//       for (let i = 0; i < 6; i++) {
//         const tempDate = new Date(d.getFullYear(), d.getMonth() + i, 1);
//         const year = tempDate.getFullYear();
//         const month = String(tempDate.getMonth() + 1).padStart(2, '0');
//         const monthName = tempDate.toLocaleString('default', { month: 'short' });
        
//         monthsTemplate.push({ 
//           key: `${year}-${month}`, 
//           name: `${monthName} ${year}`, // e.g., "Nov 2024"
//           revenue: 0 
//         });
//       }
//     }

//     // --- 2. Query Database ---
    
//     // Repair Job Cards Revenue
//     // FIX: Use COALESCE to include the 'estimate' if 'bill_amount' is not yet set. This makes the chart dynamic for new jobs.
//     const [jobRows] = await db.query(`
//       SELECT DATE_FORMAT(created_at, '%Y-%m') as month_key, SUM(COALESCE(bill_amount, estimate, 0)) as total
//       FROM jobcards
//       WHERE created_at >= ? AND created_at <= ?
//       GROUP BY month_key
//     `, [startDate, endDate]);

//     // Washing Jobs Revenue
//     const [washingRows] = await db.query(`
//       SELECT DATE_FORMAT(created_at, '%Y-%m') as month_key, SUM(bill_amount) as total
//       FROM washing_job_cards
//       WHERE created_at >= ? AND created_at <= ?
//       GROUP BY month_key
//     `, [startDate, endDate]);

//     // --- 3. Aggregate Data ---
//     const revenueMap = {};

//     jobRows.forEach(r => {
//       revenueMap[r.month_key] = (revenueMap[r.month_key] || 0) + (parseFloat(r.total) || 0);
//     });

//     washingRows.forEach(r => {
//       revenueMap[r.month_key] = (revenueMap[r.month_key] || 0) + (parseFloat(r.total) || 0);
//     });

//     // --- 4. Merge with Template (Fills gaps with 0) ---
//     const finalData = monthsTemplate.map(m => ({
//       name: m.name,
//       revenue: revenueMap[m.key] || 0
//     }));

//     res.json({ success: true, data: finalData });

//   } catch (error) {
//     console.error("❌ Monthly revenue error:", error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };




const db = require('../config/db');

/**
 * @desc    Get counts for Dashboard Cards (Job Cards, Washing, Customers, Stock)
 * @route   GET /api/dashboard/stats
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Execute all count queries in parallel for performance
    const [
      jobCardsRes,
      washingJobsRes,
      customersRes,
      stockRes
    ] = await Promise.all([
      db.query(`SELECT COUNT(*) AS total FROM jobcards`),
      db.query(`SELECT COUNT(*) AS total FROM washing_job_cards`),
      db.query(`SELECT COUNT(*) AS total FROM customers`),
      db.query(`SELECT COUNT(*) AS total FROM inventory`) 
    ]);

    // Extract values safely
    const data = {
      jobCards: jobCardsRes[0][0]?.total || 0,
      washingJobs: washingJobsRes[0][0]?.total || 0,
      customers: customersRes[0][0]?.total || 0,
      stock: stockRes[0][0]?.total || 0
    };

    res.json({ success: true, data: data });

  } catch (error) {
    console.error("❌ Dashboard Stats Error:", error.sqlMessage || error.message);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

/**
 * @desc    Get Pie Chart Data with Date Range Filter
 * @route   GET /api/dashboard/jobcard-status?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
exports.getJobCardStatusStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Base SQL
    let sql = `SELECT status, COUNT(*) AS count FROM jobcards`;
    let queryParams = [];

    // --- Add Date Filtering ---
    if (startDate && endDate) {
      // Filter by range. We add time to ensure the full end-date is covered.
      sql += ` WHERE created_at BETWEEN ? AND ?`;
      queryParams.push(`${startDate} 00:00:00`, `${endDate} 23:59:59`);
    }

    sql += ` GROUP BY status`;

    const [rows] = await db.query(sql, queryParams);

    // Initialize structure
    const result = { pending: 0, completed: 0, closed: 0 };

    rows.forEach(r => {
      const key = r.status ? r.status.toLowerCase() : 'unknown';
      
      // Map 'open' to 'pending', otherwise use exact match
      if (key === 'open' || key === 'pending') {
        result.pending += r.count;
      } else if (result.hasOwnProperty(key)) {
        result[key] += r.count;
      }
    });

    res.status(200).json({ success: true, data: result });

  } catch (error) {
    console.error("❌ Status Stats Error:", error.sqlMessage || error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc    Get Bar Chart Data (Revenue) with Preset Filters
 * @route   GET /api/dashboard/monthly-revenue?filter=...
 */
exports.getMonthlyRevenue = async (req, res) => {
  try {
    const filter = req.query.filter || '6_months';
    let startDate, endDate;
    const monthsTemplate = [];

    const now = new Date();
    const currentYear = now.getFullYear();

    // --- 1. Generate Date Ranges & Template ---
    if (filter === 'this_year') {
      startDate = `${currentYear}-01-01`;
      endDate = `${currentYear}-12-31`;
      
      // Generate Jan to Dec
      for (let i = 0; i < 12; i++) {
        const d = new Date(currentYear, i, 1);
        const key = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
        const name = d.toLocaleString('default', { month: 'short' });
        monthsTemplate.push({ key, name, revenue: 0 });
      }

    } else if (filter === 'last_year') {
      const lastYear = currentYear - 1;
      startDate = `${lastYear}-01-01`;
      endDate = `${lastYear}-12-31`;

      for (let i = 0; i < 12; i++) {
        const d = new Date(lastYear, i, 1);
        const key = `${lastYear}-${String(i + 1).padStart(2, '0')}`;
        const name = d.toLocaleString('default', { month: 'short' });
        monthsTemplate.push({ key, name, revenue: 0 });
      }

    } else {
      // Default: Last 6 Months
      const d = new Date();
      d.setMonth(d.getMonth() - 5);
      d.setDate(1); 
      
      startDate = d.toISOString().split('T')[0];
      endDate = new Date().toISOString().split('T')[0];

      for (let i = 0; i < 6; i++) {
        const tempDate = new Date(d.getFullYear(), d.getMonth() + i, 1);
        const year = tempDate.getFullYear();
        const month = String(tempDate.getMonth() + 1).padStart(2, '0');
        const monthName = tempDate.toLocaleString('default', { month: 'short' });
        
        monthsTemplate.push({ 
          key: `${year}-${month}`, 
          name: `${monthName} ${year}`,
          revenue: 0 
        });
      }
    }

    // --- 2. Query Database ---
    
    // Repair Job Cards Revenue
    // Using COALESCE(bill_amount, estimate, 0) to use estimate if bill isn't generated yet
    const [jobRows] = await db.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') as month_key, SUM(COALESCE(bill_amount, estimate, 0)) as total
      FROM jobcards
      WHERE created_at >= ? AND created_at <= ?
      GROUP BY month_key
    `, [startDate, endDate]);

    // Washing Jobs Revenue
    const [washingRows] = await db.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') as month_key, SUM(bill_amount) as total
      FROM washing_job_cards
      WHERE created_at >= ? AND created_at <= ?
      GROUP BY month_key
    `, [startDate, endDate]);

    // --- 3. Aggregate Data ---
    const revenueMap = {};

    jobRows.forEach(r => {
      revenueMap[r.month_key] = (revenueMap[r.month_key] || 0) + (parseFloat(r.total) || 0);
    });

    washingRows.forEach(r => {
      revenueMap[r.month_key] = (revenueMap[r.month_key] || 0) + (parseFloat(r.total) || 0);
    });

    // --- 4. Merge with Template (Fills gaps with 0) ---
    const finalData = monthsTemplate.map(m => ({
      name: m.name,
      revenue: revenueMap[m.key] || 0
    }));

    res.json({ success: true, data: finalData });

  } catch (error) {
    console.error("❌ Monthly revenue error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};