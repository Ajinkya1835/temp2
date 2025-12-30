
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth.routes');
const violationRoutes = require('./routes/violation.routes');
const uploadRoutes = require('./routes/upload.routes');
const paymentRoutes = require('./routes/payment.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files for uploaded evidence
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/violations', violationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);

module.exports = app;
