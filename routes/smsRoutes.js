const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');
// const { sendSms } = require('../controllers/smsController');

// Defines the route for POST /api/sms
router.post('/', smsController.sendSms);

// You can add a GET route later to see the SMS list
router.get('/', smsController.getSmsList);

router.delete('/:id', smsController.deleteSms);

module.exports = router;
