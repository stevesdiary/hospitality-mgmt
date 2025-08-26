const express = require('express');
const router = express.Router();
const verifyUserType = require('../middleware/verifyUserType');
const {authentication} = require("../middleware/authentication");
const hotelController = require('../controllers/hotelController');
const { validateBody, validateQuery, validateUuidParam } = require('../middleware/validation');
const { hotelValidation, queryValidation } = require('../utils/validationSchemas');

router.post('/createhotel', authentication, verifyUserType('admin'), validateBody(hotelValidation.create), hotelController.createHotel);

router.get('/findall', authentication, verifyUserType('admin', 'user', 'guest'), hotelController.findAllHotel);

router.get('/topdeals', authentication, verifyUserType('admin'), hotelController.topDeals);

router.get('/tophotels', authentication, verifyUserType('admin', 'user', 'guest'), hotelController.topHotelsByState);

router.get('/hotels-by-cities', authentication, verifyUserType('admin', 'user', 'guest'), hotelController.hotelsByCity);

router.get('/topdestinations', authentication, verifyUserType('admin', 'user', 'guest'), hotelController.getTopDestinations);

router.get('/findone/:id', authentication, verifyUserType('admin', 'user'), hotelController.findOneHotel);

router.get('/bydate', authentication, verifyUserType('admin', 'user'), hotelController.findHotelByDate);

router.put('/update/:id', authentication, verifyUserType('admin'), hotelController.updateHotel);

router.delete('/delete/:id', authentication, verifyUserType('admin'), hotelController.deleteHotel);



module.exports = router;
