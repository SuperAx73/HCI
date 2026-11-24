import type { Review } from '@oficios/shared';
import { db } from '../config/firebase';

const collection = () => db.collection('reviews');

/** Deterministic id so one account can only ever have one review per listing — re-submitting edits it. */
const docId = (listingId: string, authorUid: string) => `${listingId}_${authorUid}`;

export const reviewRepository = {
  async get(listingId: string, authorUid: string): Promise<Review | null> {
    const doc = await collection().doc(docId(listingId, authorUid)).get();
    return doc.exists ? (doc.data() as Review) : null;
  },

  async upsert(review: Review): Promise<void> {
    await collection().doc(docId(review.listingId, review.authorUid)).set(review, { merge: true });
  },

  async listByListing(listingId: string): Promise<Review[]> {
    const snap = await collection().where('listingId', '==', listingId).get();
    return snap.docs
      .map((d) => d.data() as Review)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
};
