import { Router } from 'express';
import { findAllUser, findOne, updateUser, deleteUser } from '../controllers/usersController';
import { authentication } from '../middleware/authentication';
import verifyUserType from '../middleware/verifyUserType';

const router = Router();

router.get('/alluser', authentication, verifyUserType(['admin', 'org_admin']), findAllUser);
router.get('/user/:id', authentication, findOne);
router.put('/updateuser/:id', authentication, updateUser);
router.delete('/deleteuser/:id', authentication, verifyUserType(['admin']), deleteUser);

export default router;
