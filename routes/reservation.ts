import { Router } from 'express';
import {
  createReservation,
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

const router = Router();

router.post('/', authentication, createReservation);
router.get('/', authentication, verifyUserType(['admin', 'org_admin']), getAllReservations);
router.get('/my', authentication, getMyReservations);
router.get('/:id', authentication, getOneReservation);
router.put('/:id', authentication, updateReservation);
router.patch('/:id/cancel', authentication, cancelReservation);
router.patch('/:id/confirm', authentication, verifyUserType(['admin', 'org_admin']), confirmReservation);
router.delete('/', authentication, verifyUserType(['admin', 'org_admin']), removeAllReservations);
router.delete('/:id', authentication, deleteReservation);

export default router;
