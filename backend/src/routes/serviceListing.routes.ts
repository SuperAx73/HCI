import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { serviceListingController } from '../controllers/serviceListing.controller';
import { reviewController } from '../controllers/review.controller';

export const serviceListingRouter = Router();

serviceListingRouter.get('/search', serviceListingController.search);
serviceListingRouter.get('/folio/:folio', serviceListingController.getByFolio);
serviceListingRouter.get('/:id/reviews', reviewController.list);
serviceListingRouter.use(requireAuth);
serviceListingRouter.post('/', serviceListingController.create);
serviceListingRouter.put('/:id', serviceListingController.update);
serviceListingRouter.get('/mine', serviceListingController.listMine);
serviceListingRouter.post('/:id/reviews', reviewController.submit);
