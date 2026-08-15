import { Router } from 'express';
import {
  createReservation,
  createGuestReservation,
  checkRoomAvailability,
  getAvailableRooms,
  getOneReservation,
  getMyReservations,
  getAllReservations,
  updateReservation,
  cancelReservation,
  confirmReservation,
  removeAllReservations,
  deleteReservation,
} from '../controllers/reservationController';
import { authentication } from '../middleware/authentication';
import verifyUserType from '../middleware/verifyUserType';
import { validateBody } from '../middleware/validation';
import { reservationValidation } from '../src/shared/utils/validationSchemas';

const router = Router();

router.post('/', authentication, validateBody(reservationValidation.create), createReservation);
router.get('/', authentication, verifyUserType(['admin', 'org_admin']), getAllReservations);
router.get('/my', authentication, getMyReservations);
router.get('/:id', authentication, getOneReservation);
router.put('/:id', authentication, updateReservation);
router.patch('/:id/cancel', authentication, cancelReservation);
router.patch('/:id/confirm', authentication, verifyUserType(['admin', 'org_admin']), confirmReservation);
router.delete('/', authentication, verifyUserType(['admin', 'org_admin']), removeAllReservations);
router.delete('/:id', authentication, deleteReservation);

export default router;
