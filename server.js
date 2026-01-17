require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors(
  {
  origin: [
    'http://localhost:3000',               // local frontend
    'https://garage-frontend-ten.vercel.app'     // vercel frontend
  ],
  methods: ['GET', 'POST', 'PUT','PATCH' ,'DELETE'],
  credentials: true
}
));

app.options('*', cors());



app.use(express.json());

// --- Route Imports ---
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const estimationRoutes = require('./routes/estimationRoutes');
const jobCardRoutes = require('./routes/jobCardRoutes');
const makeRoutes = require('./routes/M_M_VRoutes');
const modelRoutes = require('./routes/modelRoutes');
const variantRoutes = require('./routes/variantRoutes');
const quotationRoutes = require('./routes/quotationRoutes'); // The missing route
const reportsRoutes = require('./routes/reportsRoutes');
const smsRoutes = require('./routes/smsRoutes');
const stockRoutes = require('./routes/stockRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const userRoutes = require('./routes/userRoutes');
const washingCardRoutes = require('./routes/washingCardRoutes');
const washingJobRoutes = require('./routes/washingJobRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// --- API Endpoints ---
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/estimations', estimationRoutes);
app.use('/api/jobcards', jobCardRoutes);
app.use('/api/makes', makeRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/variants', variantRoutes);
app.use('/api/quotations', quotationRoutes); // This line fixes the 404 error
app.use('/api/reports', reportsRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/washing-cards', washingCardRoutes);
app.use('/api/washing-jobs', washingJobRoutes);
app.use('/api/dashboard', dashboardRoutes);


// Public uploads - serve static files with proper CORS headers
const allowedOrigins = [
  'http://localhost:3000',
  'https://garage-frontend-ten.vercel.app',
];

const staticFileOptions = {
  setHeaders: (res, filePath, stat) => {
    // If Origin header present and allowed, mirror it; otherwise fall back to wildcard
    // Note: using wildcard disallows credentials; if you need cookies set a specific origin.
    res.setHeader(
      'Access-Control-Allow-Origin',
      (req => {
        try {
          const origin = req && req.headers && req.headers.origin;
          if (origin && allowedOrigins.includes(origin)) return origin;
        } catch (e) {}
        return '*';
      })(res.req)
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // Optional: caching for performance
    res.setHeader('Cache-Control', 'public, max-age=3600');
  },
};

// 1. Primary: Serve from project root public folder (../public/uploads/profile)
app.use(
  '/uploads/profile',
  express.static(path.join(__dirname, '../public/uploads/profile'), staticFileOptions)
);

// 2. Fallback: Serve from server-local public folder (./public/uploads/profile)
// This catches files if they were accidentally saved inside the server directory
app.use(
  '/uploads/profile',
  express.static(path.join(__dirname, 'public/uploads/profile'), staticFileOptions)
);

// Fallback: Serve other static files from public root
app.use(express.static(path.join(__dirname, '../public')));



app.get('/', (req, res) => {
  res.send('Server is running!');
});





const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("update 13jan");
});









/* 
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors(
  {
  origin: [
    'http://localhost:3000',               // local frontend
    'https://garage-frontend-ten.vercel.app'     // vercel frontend
  ],
  methods: ['GET', 'POST', 'PUT','PATCH' ,'DELETE'],
  credentials: true
}
));

app.options('*', cors());



app.use(express.json());

// --- Route Imports ---
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const estimationRoutes = require('./routes/estimationRoutes');
const jobCardRoutes = require('./routes/jobCardRoutes');
const makeRoutes = require('./routes/M_M_VRoutes');
const modelRoutes = require('./routes/modelRoutes');
const variantRoutes = require('./routes/variantRoutes');
const quotationRoutes = require('./routes/quotationRoutes'); // The missing route
const reportsRoutes = require('./routes/reportsRoutes');
const smsRoutes = require('./routes/smsRoutes');
const stockRoutes = require('./routes/stockRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const userRoutes = require('./routes/userRoutes');
const washingCardRoutes = require('./routes/washingCardRoutes');
const washingJobRoutes = require('./routes/washingJobRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// --- API Endpoints ---
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/estimations', estimationRoutes);
app.use('/api/jobcards', jobCardRoutes);
app.use('/api/makes', makeRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/variants', variantRoutes);
app.use('/api/quotations', quotationRoutes); // This line fixes the 404 error
app.use('/api/reports', reportsRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/washing-cards', washingCardRoutes);
app.use('/api/washing-jobs', washingJobRoutes);
app.use('/api/dashboard', dashboardRoutes);


// Public uploads - serve static files with proper CORS headers
const allowedOrigins = [
  'http://localhost:3000',
  'https://garage-frontend-ten.vercel.app',
];

const staticFileOptions = {
  setHeaders: (res, filePath, stat) => {
    // If Origin header present and allowed, mirror it; otherwise fall back to wildcard
    // Note: using wildcard disallows credentials; if you need cookies set a specific origin.
    res.setHeader(
      'Access-Control-Allow-Origin',
      (req => {
        try {
          const origin = req && req.headers && req.headers.origin;
          if (origin && allowedOrigins.includes(origin)) return origin;
        } catch (e) {}
        return '*';
      })(res.req)
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // Optional: caching for performance
    res.setHeader('Cache-Control', 'public, max-age=3600');
  },
};

// 1. Primary: Serve from project root public folder (../public/uploads/profile)
app.use(
  '/uploads/profile',
  express.static(path.join(__dirname, '../public/uploads/profile'), {
    setHeaders: (res, filePath, stat) => {
      // If Origin header present and allowed, mirror it; otherwise fall back to wildcard
      // Note: using wildcard disallows credentials; if you need cookies set a specific origin.
      res.setHeader(
        'Access-Control-Allow-Origin',
        (req => {
          try {
            const origin = req && req.headers && req.headers.origin;
            if (origin && allowedOrigins.includes(origin)) return origin;
          } catch (e) {}
          return '*';
        })(res.req)
      );
      res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      // Optional: caching for performance
      res.setHeader('Cache-Control', 'public, max-age=3600');
    },
  })
  express.static(path.join(__dirname, '../public/uploads/profile'), staticFileOptions)
);

// 2. Fallback: Serve from server-local public folder (./public/uploads/profile)
// This catches files if they were accidentally saved inside the server directory
app.use(
  '/uploads/profile',
  express.static(path.join(__dirname, 'public/uploads/profile'), staticFileOptions)
);

// Fallback: Serve other static files from public root
app.use(express.static(path.join(__dirname, '../public')));



app.get('/', (req, res) => {
  res.send('Server is running!');
});





const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("update 13jan");
});

*/