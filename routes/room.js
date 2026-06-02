const express = require('express');
const { authentication } = require('../middleware/authentication');
const verifyUserType = require('../middleware/verifyUserType');
const { assertOwnsResource } = require('../middleware/tenantGuard');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.post('/room',         authentication, verifyUserType('admin', 'org_admin'), roomController.createRoom);
router.get('/room/:id',      authentication, verifyUserType('admin', 'org_admin'), roomController.getRoom);
router.get('/rooms',         authentication, verifyUserType('admin', 'org_admin'), roomController.getAllRooms);
router.put('/updateroom/:id',authentication, verifyUserType('admin', 'org_admin'), assertOwnsResource('Room'), roomController.updateRoom);
router.delete('/deleteroom/:id', authentication, verifyUserType('admin', 'org_admin'), assertOwnsResource('Room'), roomController.deleteRoom);

module.exports = router;
