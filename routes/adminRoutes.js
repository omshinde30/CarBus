const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admincontroller');

// Dashboard route
router.get('/dashboard', adminController.getDashboardData);

// Add more CRUD routes here...

module.exports = router;
