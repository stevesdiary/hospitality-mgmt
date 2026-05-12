const express = require('express');
const router = express.Router();
const verifyUserType = require('../middleware/verifyUserType');
const { authentication } = require('../middleware/authentication');
const { assertOwnsResource } = require('../middleware/tenantGuard');
const hotelController = require('../controllers/hotelController');
const { validateBody } = require('../middleware/validation');
const { hotelValidation } = require('../utils/validationSchemas');

router.post('/createhotel',
  authentication,
  verifyUserType('admin', 'org_admin'),
  validateBody(hotelValidation.create),
  hotelController.createHotel
);

router.get('/findall',         authentication, verifyUserType('admin', 'org_admin', 'regular', 'premium', 'guest'), hotelController.findAllHotel);
router.get('/topdeals',        authentication, verifyUserType('admin', 'org_admin', 'regular', 'premium', 'guest'), hotelController.topDeals);
router.get('/tophotels',       authentication, verifyUserType('admin', 'org_admin', 'regular', 'premium', 'guest'), hotelController.topHotelsByState);
router.get('/hotels-by-cities',authentication, verifyUserType('admin', 'org_admin', 'regular', 'premium', 'guest'), hotelController.hotelsByCity);
router.get('/topdestinations', authentication, verifyUserType('admin', 'org_admin', 'regular', 'premium', 'guest'), hotelController.getTopDestinations);
router.get('/findone/:id',     authentication, verifyUserType('admin', 'org_admin', 'regular', 'premium', 'guest'), hotelController.findOneHotel);
router.get('/bydate',          authentication, verifyUserType('admin', 'org_admin', 'regular', 'premium', 'guest'), hotelController.findHotelByDate);

router.put('/update/:id',
  authentication,
  verifyUserType('admin', 'org_admin'),
  assertOwnsResource('Hotel'),
  hotelController.updateHotel
);

router.delete('/delete/:id',
  authentication,
  verifyUserType('admin', 'org_admin'),
  assertOwnsResource('Hotel'),
  hotelController.deleteHotel
);

module.exports = router;
