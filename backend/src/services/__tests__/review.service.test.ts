import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Review, ServiceListing, AppUser } from '@oficios/shared';

const { reviewRepository, serviceListingRepository, userRepository } = vi.hoisted(() => ({
  reviewRepository: {
    get: vi.fn(),
    upsert: vi.fn(),
    listByListing: vi.fn(),
  },
  serviceListingRepository: {
    get: vi.fn(),
  },
  userRepository: {
    get: vi.fn(),
  },
}));

vi.mock('../../repositories/review.repository', () => ({ reviewRepository }));
vi.mock('../../repositories/serviceListing.repository', () => ({ serviceListingRepository }));
vi.mock('../../repositories/user.repository', () => ({ userRepository }));

const { reviewService } = await import('../review.service');

const LISTING_ID = 'listing-1';
const PROVIDER_UID = 'provider-1';
const CLIENT_UID = 'client-1';

function fakeListing(overrides: Partial<ServiceListing> = {}): ServiceListing {
  return {
    id: LISTING_ID,
    folio: 1007,
    providerUid: PROVIDER_UID,
    providerName: 'Daniela Ponce',
    telefono: '6142719583',
    oficio: 'Pintura',
    titulo: 'Pintura de interiores y exteriores',
    descripcion: 'Acabados lisos y texturizados.',
    zonaCobertura: 'Panamericana',
    precioReferencia: 120,
    fotos: [],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function fakeUser(overrides: Partial<AppUser> = {}): AppUser {
  return {
    uid: CLIENT_UID,
    email: 'cliente@example.com',
    displayName: 'Marisol H.',
    phoneVerified: false,
    roles: { client: true, provider: false },
    activeRole: 'client',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  serviceListingRepository.get.mockResolvedValue(fakeListing());
  userRepository.get.mockResolvedValue(fakeUser());
  reviewRepository.get.mockResolvedValue(null);
});

describe('reviewService.submit — a client reviewing a provider', () => {
  it('rejects a rating outside 1-5', async () => {
    await expect(reviewService.submit(LISTING_ID, CLIENT_UID, { rating: 0, comment: 'Mal' })).rejects.toThrow();
    await expect(reviewService.submit(LISTING_ID, CLIENT_UID, { rating: 6, comment: 'Mal' })).rejects.toThrow();
    expect(reviewRepository.upsert).not.toHaveBeenCalled();
  });

  it('rejects a blank comment', async () => {
    await expect(reviewService.submit(LISTING_ID, CLIENT_UID, { rating: 5, comment: '   ' })).rejects.toThrow();
    expect(reviewRepository.upsert).not.toHaveBeenCalled();
  });

  it('rejects reviewing a listing that no longer exists', async () => {
    serviceListingRepository.get.mockResolvedValue(null);
    await expect(reviewService.submit(LISTING_ID, CLIENT_UID, { rating: 5, comment: 'Buen trabajo' })).rejects.toThrow();
  });

  it('never lets a provider review their own listing', async () => {
    await expect(
      reviewService.submit(LISTING_ID, PROVIDER_UID, { rating: 5, comment: 'Mi propio trabajo es excelente' }),
    ).rejects.toThrow(/propia publicación/);
    expect(reviewRepository.upsert).not.toHaveBeenCalled();
  });

  it('saves a valid review under the author\'s real display name', async () => {
    const review = await reviewService.submit(LISTING_ID, CLIENT_UID, { rating: 4, comment: 'Muy puntual' });
    expect(review.authorName).toBe('Marisol H.');
    expect(review.rating).toBe(4);
    expect(reviewRepository.upsert).toHaveBeenCalledTimes(1);
  });

  it('rounds a fractional rating instead of rejecting it', async () => {
    const review = await reviewService.submit(LISTING_ID, CLIENT_UID, { rating: 4.6, comment: 'Excelente' });
    expect(review.rating).toBe(5);
  });

  it('falls back to "Cliente" when the author has no account record', async () => {
    userRepository.get.mockResolvedValue(null);
    const review = await reviewService.submit(LISTING_ID, CLIENT_UID, { rating: 3, comment: 'Bien' });
    expect(review.authorName).toBe('Cliente');
  });

  it('re-submitting keeps the original createdAt but refreshes updatedAt (edit, not duplicate)', async () => {
    const original: Review = {
      id: `${LISTING_ID}_${CLIENT_UID}`,
      listingId: LISTING_ID,
      authorUid: CLIENT_UID,
      authorName: 'Marisol H.',
      rating: 3,
      comment: 'Estuvo bien',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };
    reviewRepository.get.mockResolvedValue(original);

    const edited = await reviewService.submit(LISTING_ID, CLIENT_UID, { rating: 5, comment: 'Mejor de lo que recordaba' });

    expect(edited.id).toBe(original.id);
    expect(edited.createdAt).toBe(original.createdAt);
    expect(edited.updatedAt).not.toBe(original.updatedAt);
    expect(edited.rating).toBe(5);
  });
});
