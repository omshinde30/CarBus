// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const { isProfileCompleted } = require('../middlewares/profileCheck');
const bookingController = require('../controllers/bookingController');

router.get('/book', isAuthenticated, isProfileCompleted, bookingController.showBookingForm);
router.post('/book', isAuthenticated, isProfileCompleted, bookingController.submitBooking);

module.exports = router;
