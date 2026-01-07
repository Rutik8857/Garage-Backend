const express = require('express');
const cors = require('cors');
const jobCardController = require('./controllers/jobCardController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Job Card Routes
app.post('/api/jobcards', jobCardController.createJobCard);
app.get('/api/jobcards', jobCardController.getAllJobCards);
app.put('/api/jobcards/:id/status', jobCardController.updateJobCardStatus);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong! Please try again later.'
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});