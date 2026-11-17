import type { ProviderProfile } from '@oficios/shared';
import { db } from '../config/firebase';

const collection = () => db.collection('providerProfiles');

export const providerProfileRepository = {
  async get(uid: string): Promise<ProviderProfile | null> {
    const doc = await collection().doc(uid).get();
    return doc.exists ? (doc.data() as ProviderProfile) : null;
  },

  async upsert(profile: ProviderProfile): Promise<void> {
    await collection().doc(profile.uid).set(profile, { merge: true });
  },
};
