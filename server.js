require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
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


//public profile

app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));




app.get('/', (req, res) => {
  res.send('Server is running!');
});





const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});