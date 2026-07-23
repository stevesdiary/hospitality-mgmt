import { Router } from 'express';
import { register, onboardHotel, inviteStaff, login, logout, forgotPassword, resetPassword } from '../controllers/authController';
import { authentication } from '../middleware/authentication';
import verifyUserType from '../middleware/verifyUserType';
import { validateBody } from '../middleware/validation';
import { userValidation } from '../src/shared/utils/validationSchemas';

const router = Router();

router.post('/signup', validateBody(userValidation.register), register);
// Public self-serve: create a company + its first org_admin ("List your hotel").
router.post('/onboard', onboardHotel);
// Controlled staff creation, scoped to the requester's company.
router.post('/staff', authentication, verifyUserType(['admin', 'org_admin']), inviteStaff);
router.post('/login', validateBody(userValidation.login), login);
router.post('/logout', authentication, logout);
router.post('/forgot', forgotPassword);
router.post('/reset/:token', resetPassword);

export default router;
