import { Router } from 'express';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware';
import { adminController } from '../controllers/admin.controller';

export const adminRouter = Router();

adminRouter.use(requireAuth);
adminRouter.use(requireAdmin);
adminRouter.get('/verifications/pending', adminController.listPendingVerifications);
adminRouter.post('/verifications/:requestId/review', adminController.reviewVerification);
