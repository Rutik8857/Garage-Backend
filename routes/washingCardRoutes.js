// // routes/washingCardRoutes.js
// const express = require('express');
// const router = express.Router();
// const { createWashingCard, getAllWashingCards } = require('../controllers/washingCardController');

// // POST /api/washing-cards
// router.post('/', createWashingCard);

// // GET /api/washing-cards
// router.get('/', getAllWashingCards);

// module.exports = router;



const express = require("express");
const router = express.Router();
const {
  createWashingCard,
  getAllWashingCards,
} = require("../controllers/washingCardController"); // Adjust path

// @route   POST /api/washing-cards
// @desc    Create a new washing card
router.post("/", createWashingCard);

// @route   GET /api/washing-cards
// @desc    Get all washing cards
router.get("/", getAllWashingCards);

module.exports = router;