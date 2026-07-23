import { Router } from 'express';
import {
  createReservation,
  createGuestReservation,
  getOneReservation,
  lookupReservation,
  lookupByReference,
  checkIn,
  checkOut,
  getAllReservations,
  updateReservation,
  removeAllReservations,
  deleteReservation,
} from '../controllers/reservationController';
import { authentication } from '../middleware/authentication';
import verifyUserType from '../middleware/verifyUserType';

const router = Router();

router.post('/reservation', authentication, createReservation);
// Guest checkout — book from a hotel's public page without an account.
router.post('/reservation/guest', createGuestReservation);
router.get('/getone/:id', authentication, getOneReservation);
router.get('/getall', authentication, getAllReservations);

// Front-desk: look up any booking by ID or by guest booking reference (admin/org_admin)
router.get('/lookup/:id', authentication, verifyUserType(['admin', 'org_admin']), lookupReservation);
router.get('/lookup-ref/:reference', authentication, verifyUserType(['admin', 'org_admin']), lookupByReference);

// Check-in / check-out (front desk only)
router.put('/checkin/:id', authentication, verifyUserType(['admin', 'org_admin']), checkIn);
router.put('/checkout/:id', authentication, verifyUserType(['admin', 'org_admin']), checkOut);

router.put('/updatereservation/:id', authentication, updateReservation);
router.delete('/removereservations', authentication, verifyUserType(['admin', 'org_admin']), removeAllReservations);
router.delete('/deletereservation/:id', authentication, deleteReservation);

export default router;
