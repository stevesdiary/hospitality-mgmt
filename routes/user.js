const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const { authentication } = require('../middleware/authentication');
const authorise = require('../middleware/verifyUserType');

router.get('/alluser',       authentication, authorise('admin', 'org_admin'), userController.findAllUser);
router.get('/user/:id',      authentication, authorise('admin', 'org_admin'), userController.findOne);
router.put('/updateuser/:id',authentication, authorise('admin', 'org_admin'), userController.updateUser);
router.delete('/deleteuser/:id', authentication, authorise('admin'), userController.deleteUser);

module.exports = router;
