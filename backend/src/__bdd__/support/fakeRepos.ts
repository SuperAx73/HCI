import type { AppUser, Review, ServiceListing, ServiceListingFilters } from '@oficios/shared';
import { matchesQuery } from '../../repositories/serviceListing.repository';

/**
 * In-memory stand-ins for the Firestore-backed repositories, reset per scenario.
 * `search()` reuses the real `matchesQuery` so the BDD scenarios exercise the actual
 * text-matching behaviour, not a re-implementation of it.
 */
export function createFakeWorld() {
  const listings = new Map<string, ServiceListing>();
  const users = new Map<string, AppUser>();
  const reviews = new Map<string, Review>();
  let nextFolio = 1001;

  const serviceListingRepository = {
    async create(listing: ServiceListing) {
      listings.set(listing.id, listing);
    },
    async update(id: string, patch: Partial<ServiceListing>) {
      const current = listings.get(id);
      if (current) listings.set(id, { ...current, ...patch });
    },
    async get(id: string) {
      return listings.get(id) ?? null;
    },
    async getByFolio(folio: number) {
      return [...listings.values()].find((l) => l.folio === folio) ?? null;
    },
    async listByProvider(providerUid: string) {
      return [...listings.values()].filter((l) => l.providerUid === providerUid);
    },
    async search(filters: ServiceListingFilters) {
      return [...listings.values()]
        .filter((l) => l.active)
        .filter((l) => !filters.oficio || l.oficio === filters.oficio)
        .filter((l) => !filters.zonaCobertura || l.zonaCobertura === filters.zonaCobertura)
        .filter((l) => !filters.q || matchesQuery(l, filters.q));
    },
  };

  const userRepository = {
    async get(uid: string) {
      return users.get(uid) ?? null;
    },
    async create(user: AppUser) {
      users.set(user.uid, user);
    },
    async update(uid: string, patch: Partial<AppUser>) {
      const current = users.get(uid);
      if (current) users.set(uid, { ...current, ...patch });
    },
  };

  const reviewRepository = {
    async get(listingId: string, authorUid: string) {
      return reviews.get(`${listingId}_${authorUid}`) ?? null;
    },
    async upsert(review: Review) {
      reviews.set(`${review.listingId}_${review.authorUid}`, review);
    },
    async listByListing(listingId: string) {
      return [...reviews.values()]
        .filter((r) => r.listingId === listingId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
  };

  function addUser(user: Partial<AppUser> & Pick<AppUser, 'uid' | 'displayName'>) {
    const full: AppUser = {
      email: `${user.uid}@example.com`,
      phoneVerified: false,
      roles: { client: true, provider: false },
      activeRole: 'client',
      createdAt: new Date().toISOString(),
      ...user,
    };
    users.set(full.uid, full);
    return full;
  }

  async function nextSequence() {
    return nextFolio++;
  }

  return { listings, users, reviews, serviceListingRepository, userRepository, reviewRepository, addUser, nextSequence };
}

export type FakeWorld = ReturnType<typeof createFakeWorld>;
