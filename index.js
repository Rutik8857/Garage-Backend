require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');
const app = express();


const corsOptions = {
  origin: [
    'http://localhost:3000',               // local frontend
    'https://garage-frontend-ten.vercel.app'     // vercel frontend
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));



// This line imports and runs your database connection pool
require('./config/db'); 

// --- 1. Import the ROUTES file, NOT the controller ---
// Use a safe require wrapper to log missing modules cleanly
function safeRequire(path) {
  try {
    return require(path);
  } catch (err) {
    console.error(`Failed to require ${path}:`, err && err.message ? err.message : err);
    // Return a placeholder middleware so the server can start even if a module is missing
    return (req, res, next) => {
      res.status(500).json({ 
        success: false, 
        message: `Module ${path} failed to load.` 
      });
    };
  }
}

const jobCardRoutes = safeRequire('./routes/jobCardRoutes');
const stockRoutes = safeRequire('./routes/stockRoutes');
const reportsRoutes = safeRequire('./routes/reportsRoutes');
const smsRoutes = safeRequire('./routes/smsRoutes');
const washingJobRoutes = safeRequire('./routes/washingJobRoutes');
const washingCardRoutes = safeRequire('./routes/washingCardRoutes');
const quotationRoutes = safeRequire('./routes/quotationRoutes');
const estimationRoutes = safeRequire('./routes/estimationRoutes');

const customerRoutes = safeRequire('./routes/customerRoutes');
const transactionRoutes = safeRequire('./routes/transactionRoutes');
const userRoutes = safeRequire('./routes/userRoutes');
const M_M_VRoutes = safeRequire('./routes/M_M_VRoutes');
const modelRoutes = safeRequire('./routes/modelRoutes');
const variantRoutes = safeRequire('./routes/variantRoutes');
const authRoutes = safeRequire('./routes/authRoutes');

const dashboardRoutes = require("./routes/dashboardRoutes");






// Middleware
app.use(express.json());
const path = require('path');

// Serve uploaded files and static public assets
app.use('/uploads/profile', express.static(path.join(__dirname, '../public/uploads/profile')));
app.use(express.static(path.join(__dirname, '../public')));

// Trust proxy when behind load balancer / reverse proxy (ensures correct req.protocol)
app.set('trust proxy', true);

// --- 2. Use the routes file ---
// Any request starting with '/api/jobcards' will be handled by jobCardRoutes
app.use('/api/jobcards', jobCardRoutes);
// app.use('/api/customers', customerRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/washing-jobs', washingJobRoutes);
app.use('/api/washing-cards', washingCardRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/estimations', estimationRoutes);

app.use('/api/customers', customerRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);

// M_M_V routes (makes, models, variants) 
app.use('/api/makes', M_M_VRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/variants', variantRoutes);

//login
app.use('/api/auth', authRoutes);

app.use(express.urlencoded({ extended: true }));

app.use("/api/dashboard", dashboardRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'Balance Sheet API is running!' });
});

// 404 handler for undefined routes - MUST come before error handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found. Please check your API endpoint.'
  });
});

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});