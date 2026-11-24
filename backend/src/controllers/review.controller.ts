import type { Response } from 'express';
import type { AuthedRequest } from '../middleware/auth.middleware';
import { reviewService } from '../services/review.service';

export const reviewController = {
  async list(req: AuthedRequest, res: Response) {
    const reviews = await reviewService.listForListing(req.params.id!);
    res.json(reviews);
  },

  async submit(req: AuthedRequest, res: Response) {
    try {
      const review = await reviewService.submit(req.params.id!, req.uid!, req.body);
      res.status(201).json(review);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  },
};
