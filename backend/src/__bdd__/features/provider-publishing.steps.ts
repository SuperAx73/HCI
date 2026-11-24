import { loadFeature, describeFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { AppUser } from '@oficios/shared';
import { createFakeWorld } from '../support/fakeRepos';

const feature = await loadFeature('src/__bdd__/features/provider-publishing.feature');

const world = vi.hoisted(() => ({ instance: null as ReturnType<typeof import('../support/fakeRepos').createFakeWorld> | null }));

// Each mocked method looks up `world.instance` at call time (not at mock-setup time), so
// BeforeEachScenario can swap in a fresh in-memory world per scenario without re-wiring mocks.
vi.mock('../../config/firebase', () => ({ db: {} }));
vi.mock('../../repositories/serviceListing.repository', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../repositories/serviceListing.repository')>();
  return {
    ...actual,
    serviceListingRepository: {
      create: (...args: Parameters<typeof actual.serviceListingRepository.create>) =>
        world.instance!.serviceListingRepository.create(...args),
      update: (...args: Parameters<typeof actual.serviceListingRepository.update>) =>
        world.instance!.serviceListingRepository.update(...args),
      get: (...args: Parameters<typeof actual.serviceListingRepository.get>) => world.instance!.serviceListingRepository.get(...args),
      getByFolio: (...args: Parameters<typeof actual.serviceListingRepository.getByFolio>) =>
        world.instance!.serviceListingRepository.getByFolio(...args),
      listByProvider: (...args: Parameters<typeof actual.serviceListingRepository.listByProvider>) =>
        world.instance!.serviceListingRepository.listByProvider(...args),
      search: (...args: Parameters<typeof actual.serviceListingRepository.search>) =>
        world.instance!.serviceListingRepository.search(...args),
    },
  };
});
vi.mock('../../repositories/user.repository', () => ({
  userRepository: {
    get: (uid: string) => world.instance!.userRepository.get(uid),
    create: (user: AppUser) => world.instance!.userRepository.create(user),
    update: (uid: string, patch: Partial<AppUser>) => world.instance!.userRepository.update(uid, patch),
  },
}));
vi.mock('../../repositories/counter.repository', () => ({ nextSequence: () => world.instance!.nextSequence() }));
vi.mock('../../services/providerProfile.service', () => ({ providerProfileService: { getEligibility: vi.fn() } }));

world.instance = createFakeWorld();

const { serviceListingService } = await import('../../services/serviceListing.service');
const { providerProfileService } = await import('../../services/providerProfile.service');

describeFeature(feature, ({ Scenario, BeforeEachScenario }) => {
  BeforeEachScenario(() => {
    world.instance = createFakeWorld();
    vi.mocked(providerProfileService.getEligibility).mockReset();
  });

  Scenario('Un prestador elegible publica un servicio y un cliente lo encuentra', ({ Given, When, Then, And }) => {
    const PROVIDER_UID = 'provider-daniela';
    let publishedFolio: number | undefined;

    Given('un prestador elegible llamado "Daniela Ponce" con teléfono "6142719583"', () => {
      world.instance!.addUser({ uid: PROVIDER_UID, displayName: 'Daniela Ponce', phoneNumber: '6142719583' });
      vi.mocked(providerProfileService.getEligibility).mockResolvedValue({
        eligible: true,
        profileComplete: true,
        verificationApproved: true,
        missingFields: [],
      });
    });

    When('publica un servicio de "Pintura" en la zona "Panamericana"', async () => {
      const listing = await serviceListingService.create(PROVIDER_UID, {
        oficio: 'Pintura',
        titulo: 'Pintura de interiores y exteriores',
        descripcion: 'Acabados lisos y texturizados.',
        zonaCobertura: 'Panamericana',
        precioReferencia: 120,
        fotos: [],
      });
      publishedFolio = listing.folio;
    });

    Then('la publicación obtiene un folio', () => {
      expect(publishedFolio).toBeGreaterThan(0);
    });

    And('un cliente que busca "Pintura" en la zona "Panamericana" encuentra la publicación', async () => {
      const results = await world.instance!.serviceListingRepository.search({ oficio: 'Pintura', zonaCobertura: 'Panamericana' });
      expect(results.some((r) => r.folio === publishedFolio)).toBe(true);
    });

    And('un cliente que busca por el nombre "daniela" también la encuentra', async () => {
      const results = await world.instance!.serviceListingRepository.search({ q: 'daniela' });
      expect(results.some((r) => r.folio === publishedFolio)).toBe(true);
    });
  });

  Scenario('Un prestador sin verificación aprobada no puede publicar', ({ Given, When, Then, And }) => {
    const PROVIDER_UID = 'provider-jorge';
    let publishError: Error | null = null;

    Given('un prestador NO elegible llamado "Jorge Baeza"', () => {
      world.instance!.addUser({ uid: PROVIDER_UID, displayName: 'Jorge Baeza' });
      vi.mocked(providerProfileService.getEligibility).mockResolvedValue({
        eligible: false,
        profileComplete: false,
        verificationApproved: false,
        missingFields: ['descripcion'],
      });
    });

    When('intenta publicar un servicio de "Pintura" en la zona "Las Granjas"', async () => {
      try {
        await serviceListingService.create(PROVIDER_UID, {
          oficio: 'Pintura',
          titulo: 'Pintor de fachadas',
          descripcion: '',
          zonaCobertura: 'Las Granjas',
          precioReferencia: 150,
          fotos: [],
        });
      } catch (err) {
        publishError = err as Error;
      }
    });

    Then('la publicación es rechazada', () => {
      expect(publishError).not.toBeNull();
    });

    And('un cliente que busca "Pintura" en la zona "Las Granjas" no encuentra ninguna publicación', async () => {
      const results = await world.instance!.serviceListingRepository.search({ oficio: 'Pintura', zonaCobertura: 'Las Granjas' });
      expect(results).toHaveLength(0);
    });
  });
});
