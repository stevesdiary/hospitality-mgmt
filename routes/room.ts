import { Router } from 'express';
import { createRoom, getRoom, getAllRooms, updateRoom, deleteRoom } from '../controllers/roomController';
import { authentication } from '../middleware/authentication';
import verifyUserType from '../middleware/verifyUserType';

const router = Router();

router.post('/room', authentication, verifyUserType(['admin', 'org_admin']), createRoom);
router.get('/room/:id', getRoom);
router.get('/rooms', getAllRooms);
router.put('/updateroom/:id', authentication, verifyUserType(['admin', 'org_admin']), updateRoom);
router.delete('/deleteroom/:id', authentication, verifyUserType(['admin', 'org_admin']), deleteRoom);

export default router;
