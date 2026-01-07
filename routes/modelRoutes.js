const express = require("express");
const router = express.Router();
const mmvController = require('../controllers/M_M_VController');

/*
  Base path for this router is /api/models, configured in server.js
*/

// GET /api/models/:makeId
// The frontend calls this endpoint with the ID of the selected make.
// This route now correctly captures that ID as a parameter (`makeId`).
router.get('/:makeId', mmvController.getModelsByMake);

// POST /api/models
// This route is for creating a new model.
router.post('/', mmvController.createModel);

module.exports = router;
