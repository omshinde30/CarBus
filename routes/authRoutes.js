const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/get-user', (req, res) => {
    if (req.session.user) {
      const names = req.session.user.fullName.trim().split(" ");
      const initials = (names[0][0] + (names[1]?.[0] || '')).toUpperCase();
      res.json({ initials });
    } else {
      res.json({ initials: null });
    }
  });
  
module.exports = router;
