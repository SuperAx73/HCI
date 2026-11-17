import type { AppUser } from '@oficios/shared';
import { db } from '../config/firebase';

const collection = () => db.collection('users');

export const userRepository = {
  async get(uid: string): Promise<AppUser | null> {
    const doc = await collection().doc(uid).get();
    return doc.exists ? (doc.data() as AppUser) : null;
  },

  async create(user: AppUser): Promise<void> {
    await collection().doc(user.uid).set(user);
  },

  async update(uid: string, patch: Partial<AppUser>): Promise<void> {
    await collection().doc(uid).set(patch, { merge: true });
  },
};
