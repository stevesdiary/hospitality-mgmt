import { Router } from 'express';
import {
  createReservation,
  getOneReservation,
  getAllReservations,
  updateReservation,
  removeAllReservations,
  deleteReservation,
} from '../controllers/reservationController';
import { authentication } from '../middleware/authentication';
import verifyUserType from '../middleware/verifyUserType';

const router = Router();

router.post('/reservation', authentication, createReservation);
router.get('/getone/:id', authentication, getOneReservation);
router.get('/getall', authentication, getAllReservations);
router.put('/updatereservation/:id', authentication, updateReservation);
router.delete('/removereservations', authentication, verifyUserType(['admin', 'org_admin']), removeAllReservations);
router.delete('/deletereservation/:id', authentication, deleteReservation);

export default router;
