// routes/washingJobRoutes.js
const express = require('express');
const router = express.Router();
const washingJobController = require('../controllers/washingJobController');

// This MUST be router.post('/')
// It should NOT be router.post('/washing-jobs', ...)

// POST /api/washing-jobs/ -> create a new washing job
router.post('/', washingJobController.createWashingJob);

// GET /api/washing-jobs/ -> retrieve all washing jobs
router.get('/', washingJobController.getAllWashingJobs);

// GET /api/washing-jobs/:id -> retrieve single washing job
router.get('/:id', washingJobController.getWashingJobById);

// PUT /api/washing-jobs/:id -> full update of a washing job
router.put('/:id', washingJobController.updateWashingJob);

// PUT /api/washing-jobs/:id/status -> update status of a job
router.put('/:id/status', washingJobController.updateWashingJobStatus);



module.exports = router;