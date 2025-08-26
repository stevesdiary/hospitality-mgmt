const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const { validateBody } = require('../middleware/validation');
const { userValidation } = require('../utils/validationSchemas');

// Registration with validation
router.post('/signup', validateBody(userValidation.register), registerController.registerUser);

module.exports = router;