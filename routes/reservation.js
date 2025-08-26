const express = require('express');
const router = express.Router();
const { authentication } = require("../middleware/authentication");
const verifyUserType = require("../middleware/verifyUserType");
const reservationController = require('../controllers/reservationController');
const { validateBody, validateUuidParam } = require('../middleware/validation');
const { reservationValidation } = require('../utils/validationSchemas');
const { customValidations } = require('../middleware/validation');

router.post('/reservation', 
  authentication, 
  verifyUserType('regular', 'premium'), 
  validateBody(reservationValidation.create),
  customValidations.validateReservationDates,
  reservationController.createReservation
);

router.get('/getone/:id', authentication, verifyUserType('admin', 'regular', 'premium'), validateUuidParam('id'), reservationController.getOne);

router.get('/getall', authentication, verifyUserType('admin'), reservationController.getAll);

router.put('/updatereservation/:id', authentication, verifyUserType('admin'), validateUuidParam('id'), reservationController.updateReservation);

router.delete('/removereservations', authentication, verifyUserType('admin'), reservationController.removeReservations);

router.delete('/deletereservation/:id', authentication, verifyUserType('admin'), validateUuidParam('id'), reservationController.deleteReservation);

module.exports = router;