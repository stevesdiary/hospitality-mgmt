const express = require('express');
const router = express.Router();

const loginController = require('../controllers/loginController');

router.post('/login', authenticateToken, loginController.login);

module.exports = router;