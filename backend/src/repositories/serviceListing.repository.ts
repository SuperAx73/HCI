import type { ServiceListing, ServiceListingFilters } from '@oficios/shared';
import { normalizeSearchText } from '@oficios/shared';
import { db } from '../config/firebase';

const collection = () => db.collection('serviceListings');

/**
 * Free-text match against providerName, titulo, or folio — pulled out so it's testable without a
 * live Firestore query (search() only applies it after the indexed oficio/zona filters run).
 */
export function matchesQuery(listing: ServiceListing, rawQuery: string): boolean {
  const q = rawQuery.trim() ? normalizeSearchText(rawQuery.trim()) : '';
  if (!q) return true;

  const qDigits = q.replace(/\D/g, '');
  const nameMatch = !!listing.providerName && normalizeSearchText(listing.providerName).includes(q);
  const titleMatch = !!listing.titulo && normalizeSearchText(listing.titulo).includes(q);
  const folioMatch = qDigits.length > 0 && String(listing.folio).includes(qDigits);
  return nameMatch || titleMatch || folioMatch;
}

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

  async getByFolio(folio: number): Promise<ServiceListing | null> {
    const snap = await collection().where('folio', '==', folio).limit(1).get();
    return snap.empty ? null : (snap.docs[0]!.data() as ServiceListing);
  },

  async search(filters: ServiceListingFilters): Promise<ServiceListing[]> {
    let query: FirebaseFirestore.Query = collection().where('active', '==', true);
    if (filters.oficio) query = query.where('oficio', '==', filters.oficio);
    if (filters.zonaCobertura) query = query.where('zonaCobertura', '==', filters.zonaCobertura);
    const snap = await query.get();
    const listings = snap.docs.map((d) => d.data() as ServiceListing);
    return filters.q ? listings.filter((l) => matchesQuery(l, filters.q!)) : listings;
  },
};
