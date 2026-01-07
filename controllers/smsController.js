const db = require('../config/db');

/**
 * @desc    Save a new SMS to be sent
 * @route   POST /api/sms
 */
const sendSms = async (req, res) => {
  // Get data from the frontend form
  const { sendOption, scheduledDate, scheduledTime, message } = req.body;

  // Validation
  if (!message || !sendOption || !scheduledDate) {
    return res.status(400).json({ 
      success: false, 
      message: 'Message, send option, and date are required.' 
    });
  }

  // Determine the status and scheduled time for the database
  let status = 'pending';
  let scheduled_at = null;

  if (sendOption === 'now') {
    status = 'sent';
    scheduled_at = new Date(); // Set to now
  } else {
    // Combine date and time for schedule
    if (!scheduledTime) {
      return res.status(400).json({ success: false, message: 'Schedule time is required.' });
    }
    scheduled_at = `${scheduledDate} ${scheduledTime}:00`;
  }

  // In a real app, you would add logic here to send the SMS
  // via a service like Twilio, especially if status === 'sent'.
  // For now, we are just logging it to the database.

  try {
    const sql = `
      INSERT INTO sms_log (message, send_option, status, scheduled_at) 
      VALUES (?, ?, ?, ?)
    `;
    
    const [result] = await db.query(sql, [message, sendOption, status, scheduled_at]);

    res.status(201).json({
      success: true,
      message: `SMS has been ${status} successfully!`,
      smsId: result.insertId,
    });
  } catch (err) {
    console.error('Error saving SMS:', err);
    res.status(500).json({ success: false, message: 'Failed to save SMS due to a server error.' });
  }
};

const getSmsList = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, message, send_option, status, scheduled_at, created_at FROM sms_log ORDER BY created_at DESC');
    // Map DB columns to the shape the frontend expects (srNo, datetime, message, customer)
    const data = rows.map((r, idx) => ({
      srNo: r.id, // or idx+1
      datetime: r.scheduled_at || r.created_at,
      message: r.message,
      customer: r.customer_name || '', // if you have customer column; empty if not
      // attach other fields if needed
    }));
    res.json({ success: true, data });
  } catch (err) {
    console.error('Error fetching SMS list:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch SMS list.' });
  }
};

// const deleteSms = async (req, res) => {
//   const { id } = req.params;
//   try {
//     await db.query('DELETE FROM sms_log WHERE id = ?', [id]);
//     res.json({ success: true, message: 'SMS deleted.' });
//   } catch (err) {
//     console.error('Error deleting SMS:', err);
//     res.status(500).json({ success: false, message: 'Failed to delete SMS.' });
//   }
// };

const deleteSms = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM sms_log WHERE id = ?', [id]);
    res.json({ success: true, message: 'SMS deleted.' });
  } catch (err) {
    console.error('Error deleting SMS:', err);
    res.status(500).json({ success: false, message: 'Failed to delete SMS.' });
  }
};

module.exports = {
  sendSms,
  getSmsList,
  deleteSms
};