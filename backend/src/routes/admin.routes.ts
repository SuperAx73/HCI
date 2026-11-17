import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { adminController } from '../controllers/admin.controller';

export const adminRouter = Router();

// NOTE: prototype-level guard only. A real deployment must check an admin
// custom-claim in requireAuth before reaching these handlers.
adminRouter.use(requireAuth);
adminRouter.get('/verifications/pending', adminController.listPendingVerifications);
adminRouter.post('/verifications/:requestId/review', adminController.reviewVerification);
