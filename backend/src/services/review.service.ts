import { randomUUID } from 'node:crypto';
import type { Review, ReviewInput } from '@oficios/shared';
import { reviewRepository } from '../repositories/review.repository';
import { serviceListingRepository } from '../repositories/serviceListing.repository';
import { userRepository } from '../repositories/user.repository';

export const reviewService = {
  async listForListing(listingId: string): Promise<Review[]> {
    return reviewRepository.listByListing(listingId);
  },

  async submit(listingId: string, authorUid: string, input: ReviewInput): Promise<Review> {
    const rating = Math.round(input.rating);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      throw new Error('La calificación debe ser un número entre 1 y 5');
    }
    const comment = input.comment.trim();
    if (!comment) {
      throw new Error('Escribe un comentario breve');
    }

    const listing = await serviceListingRepository.get(listingId);
    if (!listing) {
      throw new Error('Esa publicación ya no existe');
    }
    if (listing.providerUid === authorUid) {
      throw new Error('No puedes dejar una reseña en tu propia publicación');
    }

    const [author, existing] = await Promise.all([userRepository.get(authorUid), reviewRepository.get(listingId, authorUid)]);
    const now = new Date().toISOString();
    const review: Review = {
      id: `${listingId}_${authorUid}`,
      listingId,
      authorUid,
      authorName: author?.displayName ?? 'Cliente',
      rating,
      comment,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    await reviewRepository.upsert(review);
    return review;
  },
};
