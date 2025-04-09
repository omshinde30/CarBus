const express = require('express');
const router = express.Router();
const authController = require('../controllers/user');

router.post('/', authController.registration);
router.post('/', authController.login);
router.get('/', authController.logout);

module.exports = router;
