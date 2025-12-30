
const express = require('express');
const router = express.Router();
const { reportViolation, verifyViolation, getViolationStats } = require('../controllers/violation.controller');
const protect = require('../middleware/auth');
const authorize = require('../middleware/roleCheck');
const Roles = require('../models/Role');

// Citizen or any logged in user can report
router.post('/', protect, reportViolation);

// Only Municipal Officers or Admins can verify and issue notices
router.patch('/:id/verify', protect, authorize(Roles.MUNICIPAL_OFFICER, Roles.SUPER_ADMIN), verifyViolation);

// Stats route
router.get('/stats', protect, authorize(Roles.MUNICIPAL_OFFICER, Roles.SUPER_ADMIN), getViolationStats);

module.exports = router;
