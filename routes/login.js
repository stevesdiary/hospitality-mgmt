const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const { authentication } = require('../middleware/authentication');
const verifyUserType = require('../middleware/verifyUserType');
const { validateBody } = require('../middleware/validation');
const { userValidation } = require('../utils/validationSchemas');

router.post('/login', validateBody(userValidation.login), loginController.login);
router.post('/logout', loginController.logout);

module.exports = router;