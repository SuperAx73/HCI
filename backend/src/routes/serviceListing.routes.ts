import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { serviceListingController } from '../controllers/serviceListing.controller';

export const serviceListingRouter = Router();

serviceListingRouter.get('/search', serviceListingController.search);
serviceListingRouter.use(requireAuth);
serviceListingRouter.post('/', serviceListingController.create);
serviceListingRouter.put('/:id', serviceListingController.update);
serviceListingRouter.get('/mine', serviceListingController.listMine);
