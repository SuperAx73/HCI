import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AppUser } from '@oficios/shared';

const { serviceListingRepository, providerProfileService, nextSequence, userRepository } = vi.hoisted(() => ({
  serviceListingRepository: {
    create: vi.fn(),
    search: vi.fn(),
  },
  providerProfileService: {
    getEligibility: vi.fn(),
  },
  nextSequence: vi.fn(),
  userRepository: {
    get: vi.fn(),
  },
}));

vi.mock('../../repositories/serviceListing.repository', () => ({ serviceListingRepository }));
vi.mock('../providerProfile.service', () => ({ providerProfileService }));
vi.mock('../../repositories/counter.repository', () => ({ nextSequence }));
vi.mock('../../repositories/user.repository', () => ({ userRepository }));

const { serviceListingService } = await import('../serviceListing.service');

const PROVIDER_UID = 'provider-1';

function fakeUser(overrides: Partial<AppUser> = {}): AppUser {
  return {
    uid: PROVIDER_UID,
    email: 'prestador@example.com',
    displayName: 'Daniela Ponce',
    phoneNumber: '6142719583',
    phoneVerified: true,
    roles: { client: true, provider: true },
    activeRole: 'provider',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

const NEW_LISTING_INPUT = {
  oficio: 'Pintura',
  titulo: 'Pintura de interiores y exteriores',
  descripcion: 'Acabados lisos y texturizados.',
  zonaCobertura: 'Panamericana',
  precioReferencia: 120,
  fotos: [],
};

beforeEach(() => {
  vi.clearAllMocks();
  userRepository.get.mockResolvedValue(fakeUser());
  nextSequence.mockResolvedValue(1007);
});

describe('serviceListingService.create — a provider publishing a service', () => {
  it('refuses to publish when the provider is not yet eligible', async () => {
    providerProfileService.getEligibility.mockResolvedValue({ eligible: false });

    await expect(serviceListingService.create(PROVIDER_UID, NEW_LISTING_INPUT)).rejects.toThrow();
    expect(serviceListingRepository.create).not.toHaveBeenCalled();
  });

  it('publishes the listing once the provider is eligible, stamping folio, name and phone from the account', async () => {
    providerProfileService.getEligibility.mockResolvedValue({ eligible: true });

    const listing = await serviceListingService.create(PROVIDER_UID, NEW_LISTING_INPUT);

    expect(listing.folio).toBe(1007);
    expect(listing.providerName).toBe('Daniela Ponce');
    expect(listing.telefono).toBe('6142719583');
    expect(listing.active).toBe(true);
    expect(serviceListingRepository.create).toHaveBeenCalledWith(listing);
  });

  it('still publishes (without a phone number) when the account has none on file yet', async () => {
    providerProfileService.getEligibility.mockResolvedValue({ eligible: true });
    userRepository.get.mockResolvedValue(fakeUser({ phoneNumber: undefined }));

    const listing = await serviceListingService.create(PROVIDER_UID, NEW_LISTING_INPUT);

    expect(listing.telefono).toBe('');
  });
});
