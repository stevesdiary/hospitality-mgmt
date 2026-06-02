const express = require('express');
const router = express.Router();
const { authentication } = require('../middleware/authentication');
const verifyUserType = require('../middleware/verifyUserType');
const { assertOwnsResource } = require('../middleware/tenantGuard');
const reservationController = require('../controllers/reservationController');
const { validateBody, validateUuidParam, customValidations } = require('../middleware/validation');
const { reservationValidation } = require('../utils/validationSchemas');

router.post('/reservation',
  authentication,
  verifyUserType('regular', 'premium'),
  validateBody(reservationValidation.create),
  customValidations.validateReservationDates,
  reservationController.createReservation
);

router.get('/getone/:id',         authentication, verifyUserType('admin', 'org_admin', 'regular', 'premium'), validateUuidParam('id'), reservationController.getOne);
router.get('/getall',             authentication, verifyUserType('admin', 'org_admin'), reservationController.getAll);
router.put('/updatereservation/:id', authentication, verifyUserType('admin', 'org_admin'), validateUuidParam('id'), assertOwnsResource('Reservation'), reservationController.updateReservation);
router.delete('/removereservations', authentication, verifyUserType('admin', 'org_admin'), reservationController.removeReservations);
router.delete('/deletereservation/:id', authentication, verifyUserType('admin', 'org_admin'), validateUuidParam('id'), assertOwnsResource('Reservation'), reservationController.deleteReservation);

module.exports = router;
