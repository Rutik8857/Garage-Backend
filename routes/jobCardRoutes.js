const express = require("express");
const router = express.Router();

const jobCardController = require("../controllers/jobCardController");

/*
 Base path:
 app.use("/api/jobcards", router);
*/

// CREATE
router.post("/", jobCardController.createJobCard);

// DOWNLOAD excel - MUST COME BEFORE /:id
router.get("/excel", jobCardController.downloadJobcardsExcel);

// GET all
router.get("/", jobCardController.getAllJobCards);

// GET by ID
router.get("/:id", jobCardController.getJobCardById);

// UPDATE status
router.put("/:id/status", jobCardController.updateJobCardStatus);

// UPDATE full
router.patch("/:id", jobCardController.updateJobCard);

// DELETE
router.delete("/:id", jobCardController.deleteJobCard);

module.exports = router;
