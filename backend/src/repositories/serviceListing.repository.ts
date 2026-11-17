import type { ServiceListing, ServiceListingFilters } from '@oficios/shared';
import { db } from '../config/firebase';

const collection = () => db.collection('serviceListings');

export const serviceListingRepository = {
  async create(listing: ServiceListing): Promise<void> {
    await collection().doc(listing.id).set(listing);
  },

  async update(id: string, patch: Partial<ServiceListing>): Promise<void> {
    await collection().doc(id).set(patch, { merge: true });
  },

  async get(id: string): Promise<ServiceListing | null> {
    const doc = await collection().doc(id).get();
    return doc.exists ? (doc.data() as ServiceListing) : null;
  },

  async listByProvider(providerUid: string): Promise<ServiceListing[]> {
    const snap = await collection().where('providerUid', '==', providerUid).get();
    return snap.docs.map((d) => d.data() as ServiceListing);
  },

  async search(filters: ServiceListingFilters): Promise<ServiceListing[]> {
    let query: FirebaseFirestore.Query = collection().where('active', '==', true);
    if (filters.oficio) query = query.where('oficio', '==', filters.oficio);
    if (filters.zonaCobertura) query = query.where('zonaCobertura', '==', filters.zonaCobertura);
    const snap = await query.get();
    return snap.docs.map((d) => d.data() as ServiceListing);
  },
};
