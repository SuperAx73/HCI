import { loadFeature, describeFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { ServiceListing } from '@oficios/shared';
import { createFakeWorld } from '../support/fakeRepos';

const feature = await loadFeature('src/__bdd__/features/reviews.feature');

const world = vi.hoisted(() => ({ instance: null as ReturnType<typeof import('../support/fakeRepos').createFakeWorld> | null }));

vi.mock('../../config/firebase', () => ({ db: {} }));
vi.mock('../../repositories/review.repository', () => ({
  reviewRepository: {
    get: (...args: [string, string]) => world.instance!.reviewRepository.get(...args),
    upsert: (...args: Parameters<ReturnType<typeof createFakeWorld>['reviewRepository']['upsert']>) =>
      world.instance!.reviewRepository.upsert(...args),
    listByListing: (listingId: string) => world.instance!.reviewRepository.listByListing(listingId),
  },
}));
vi.mock('../../repositories/serviceListing.repository', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../repositories/serviceListing.repository')>();
  return {
    ...actual,
    serviceListingRepository: {
      ...actual.serviceListingRepository,
      get: (id: string) => world.instance!.serviceListingRepository.get(id),
      create: (listing: ServiceListing) => world.instance!.serviceListingRepository.create(listing),
    },
  };
});
vi.mock('../../repositories/user.repository', () => ({
  userRepository: {
    get: (uid: string) => world.instance!.userRepository.get(uid),
  },
}));

world.instance = createFakeWorld();

const { reviewService } = await import('../../services/review.service');

const PROVIDER_UID = 'provider-daniela';
const CLIENT_UID = 'client-marisol';
const LISTING_ID = 'listing-1007';

async function seedListingAndClient() {
  // Reset here (rather than relying on BeforeEachScenario's ordering relative to Background)
  // so each scenario is guaranteed to start from a clean world.
  world.instance = createFakeWorld();
  world.instance.addUser({ uid: PROVIDER_UID, displayName: 'Daniela Ponce' });
  world.instance!.addUser({ uid: CLIENT_UID, displayName: 'Marisol' });
  await world.instance!.serviceListingRepository.create({
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
  });
}

describeFeature(feature, ({ Background, Scenario }) => {
  Background(({ Given }) => {
    Given('existe una publicación de "Daniela Ponce" con folio 1007', seedListingAndClient);
  });

  Scenario('Un cliente deja una reseña', ({ When, Then, And }) => {
    When('el cliente "Marisol" califica con 5 estrellas y comenta "Excelente trabajo"', async () => {
      await reviewService.submit(LISTING_ID, CLIENT_UID, { rating: 5, comment: 'Excelente trabajo' });
    });

    Then('la reseña queda guardada con el nombre del cliente', async () => {
      const reviews = await world.instance!.reviewRepository.listByListing(LISTING_ID);
      expect(reviews).toHaveLength(1);
      expect(reviews[0]!.authorName).toBe('Marisol');
    });

    And('el promedio de la publicación es 5', async () => {
      const reviews = await world.instance!.reviewRepository.listByListing(LISTING_ID);
      const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      expect(average).toBe(5);
    });
  });

  Scenario('Un prestador no puede reseñar su propia publicación', ({ When, Then }) => {
    let error: Error | null = null;

    When('el prestador "Daniela Ponce" intenta calificarse a sí misma con 5 estrellas', async () => {
      try {
        await reviewService.submit(LISTING_ID, PROVIDER_UID, { rating: 5, comment: 'Soy la mejor' });
      } catch (err) {
        error = err as Error;
      }
    });

    Then('la reseña es rechazada', () => {
      expect(error).not.toBeNull();
    });
  });

  Scenario('Editar una reseña actualiza en vez de duplicar', ({ Given, When, Then, And }) => {
    Given('el cliente "Marisol" ya calificó con 3 estrellas y comentó "Estuvo bien"', async () => {
      await reviewService.submit(LISTING_ID, CLIENT_UID, { rating: 3, comment: 'Estuvo bien' });
    });

    When('el cliente "Marisol" vuelve a calificar con 5 estrellas y comenta "Mejor de lo que pensé"', async () => {
      await reviewService.submit(LISTING_ID, CLIENT_UID, { rating: 5, comment: 'Mejor de lo que pensé' });
    });

    Then('solo existe una reseña de "Marisol" para esa publicación', async () => {
      const reviews = await world.instance!.reviewRepository.listByListing(LISTING_ID);
      expect(reviews).toHaveLength(1);
    });

    And('la reseña actualizada tiene 5 estrellas', async () => {
      const reviews = await world.instance!.reviewRepository.listByListing(LISTING_ID);
      expect(reviews[0]!.rating).toBe(5);
      expect(reviews[0]!.comment).toBe('Mejor de lo que pensé');
    });
  });
});
