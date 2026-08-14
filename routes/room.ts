import { Router } from 'express';
import { createRoom, getRoom, getRoomsByHotel, getAllRooms, updateRoom, deleteRoom } from '../controllers/roomController';
import { authentication } from '../middleware/authentication';
import verifyUserType from '../middleware/verifyUserType';

const router = Router();

router.post('/', authentication, verifyUserType(['admin', 'org_admin']), createRoom);
router.get('/', getAllRooms);
router.get('/hotel/:hotelId', getRoomsByHotel);
router.get('/:id', getRoom);
router.put('/:id', authentication, verifyUserType(['admin', 'org_admin']), updateRoom);
router.delete('/:id', authentication, verifyUserType(['admin', 'org_admin']), deleteRoom);

export default router;
