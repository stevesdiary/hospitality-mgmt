import { Router } from 'express';
import { register, login, logout, forgotPassword, resetPassword } from '../controllers/authController';
import { authentication } from '../middleware/authentication';
import { validateBody } from '../middleware/validation';
import { userValidation } from '../src/shared/utils/validationSchemas';

const router = Router();

router.post('/signup', validateBody(userValidation.register), register);
router.post('/login', validateBody(userValidation.login), login);
router.post('/logout', authentication, logout);
router.post('/forgot', forgotPassword);
router.post('/reset/:token', resetPassword);

export default router;
