import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { authController } from '../controllers/auth.controller';

export const authRouter = Router();

authRouter.use(requireAuth);
authRouter.get('/me', authController.me);
authRouter.post('/register', authController.register);
authRouter.post('/verify-phone', authController.verifyPhone);
authRouter.post('/switch-role', authController.switchRole);
