
const express = require('express');
const router = express.Router();
const { 
  initiatePayment, 
  confirmPayment, 
  processEscalations 
} = require('../controllers/payment.controller');
const protect = require('../middleware/auth');
const authorize = require('../middleware/roleCheck');
const Roles = require('../models/Role');

// Citizen/Permit Holder Routes
router.post('/initiate', protect, initiatePayment);
router.post('/confirm', protect, confirmPayment); // Gateway simulation

// Admin/Officer Fiscal Management
router.post('/escalate', protect, authorize(Roles.SUPER_ADMIN, Roles.MUNICIPAL_OFFICER), processEscalations);

module.exports = router;
