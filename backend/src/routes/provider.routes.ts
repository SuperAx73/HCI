import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { providerController } from '../controllers/provider.controller';

export const providerRouter = Router();

providerRouter.use(requireAuth);
providerRouter.get('/profile', providerController.getProfile);
providerRouter.put('/profile', providerController.upsertProfile);
providerRouter.post('/verification', providerController.submitVerification);
providerRouter.get('/eligibility', providerController.getEligibility);
providerRouter.get('/:uid/eligibility', providerController.getEligibility);
