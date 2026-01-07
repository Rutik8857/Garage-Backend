const express = require('express');
const cors = require('cors');

// This line imports and runs your database connection pool
require('./config/db'); 

// Import routes
const jobCardRoutes = require('./routes/jobCardRoutes'); 
const stockRoutes = require('./routes/stockRoutes');
const reportsRoutes = require('./routes/reportsRoutes');
const smsRoutes = require('./routes/smsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/jobcards', jobCardRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/sms', smsRoutes);

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