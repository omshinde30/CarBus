const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const Report = require('../models/Report');

exports.getDashboardData = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const cars = await Car.countDocuments();
    const bookings = await Booking.countDocuments();
    const reports = await Report.countDocuments();

    res.json({ users, cars, bookings, reports });
  } catch (error) {
    res.status(500).send('Server Error');
  }
};
