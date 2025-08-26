const express = require('express');
const verifyUserType = require('../middleware/verifyUserType');
const router = express.Router();
const facilityController = require('../controllers/facilityController');
const { authentication } = require('../middleware/authentication');

router.post('/createfacility', authentication, verifyUserType('admin'), facilityController.createFacility);

router.get('/findfacility/:hotel_id', authentication, verifyUserType('admin', 'regular', 'premium', 'guest'), facilityController.getFacility);

router.get('/findfacilities', authentication, verifyUserType('admin', 'regular', 'premium', 'guest'), facilityController.getAllFacilities);

router.put('/facility/:id', authentication, verifyUserType('admin'), facilityController.updateFacility);

router.delete('/facility/:id', authentication, verifyUserType('admin'), facilityController.deleteFacility);

module.exports = router;