import type { VerificationRequest } from '@oficios/shared';
import { db } from '../config/firebase';

const collection = () => db.collection('verificationRequests');

export const verificationRequestRepository = {
  async create(req: VerificationRequest): Promise<void> {
    await collection().doc(req.id).set(req);
  },

  async get(id: string): Promise<VerificationRequest | null> {
    const doc = await collection().doc(id).get();
    return doc.exists ? (doc.data() as VerificationRequest) : null;
  },

  async listPending(): Promise<VerificationRequest[]> {
    const snap = await collection().where('status', '==', 'pending').get();
    return snap.docs.map((d) => d.data() as VerificationRequest);
  },

  async update(id: string, patch: Partial<VerificationRequest>): Promise<void> {
    await collection().doc(id).set(patch, { merge: true });
  },
};
