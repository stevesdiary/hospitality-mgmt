import { Router } from 'express';
import { findAllUser, findOne, updateUser, deleteUser } from '../controllers/usersController';
import { authentication } from '../middleware/authentication';
import verifyUserType from '../middleware/verifyUserType';

const router = Router();

router.get('/alluser', authentication, verifyUserType(['admin', 'org_admin']), findAllUser);
router.get('/user/:id', authentication, findOne);
router.put('/updateuser/:id', authentication, updateUser);
// Scope is enforced in the controller (canAccessUser): platform admin any,
// org_admin their company, and a user may delete their own account.
router.delete('/deleteuser/:id', authentication, deleteUser);

export default router;
