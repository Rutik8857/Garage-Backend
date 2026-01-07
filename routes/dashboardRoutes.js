// const express = require('express');
// const router = express.Router();
// const dashboardController = require('../controllers/dashboardController');

// // Route to get overall stats for dashboard cards
// router.get('/stats', dashboardController.getDashboardStats);

// // Route to get status counts for the job cards pie chart
// router.get('/jobcard-status', dashboardController.getJobCardStatusStats);

// module.exports = router;



const express = require('express');
const router = express.Router();


const dashboardController = require('../controllers/dashboardController');

const {
  getDashboardStats,
  getJobCardStatusStats
} = require('../controllers/dashboardController');

router.get('/monthly-revenue', dashboardController.getMonthlyRevenue);
router.get('/stats', getDashboardStats);
router.get('/jobcard-status', getJobCardStatusStats);

module.exports = router;
