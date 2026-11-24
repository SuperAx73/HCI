import { loadFeature, describeFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { ServiceListing } from '@oficios/shared';
import { createFakeWorld } from '../support/fakeRepos';

// fakeRepos pulls in matchesQuery from the real repository module, which touches Firebase config
// at import time — stub it so this test doesn't need real credentials.
vi.mock('../../config/firebase', () => ({ db: {} }));

const feature = await loadFeature('src/__bdd__/features/client-search.feature');

function fakeListing(overrides: Partial<ServiceListing>): ServiceListing {
  const now = new Date().toISOString();
  return {
    id: `listing-${overrides.folio}`,
    folio: 0,
    providerUid: `provider-${overrides.folio}`,
    providerName: '',
    telefono: '',
    oficio: '',
    titulo: '',
    descripcion: '',
    zonaCobertura: '',
    precioReferencia: 0,
    fotos: [],
    active: true,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

let world = createFakeWorld();

async function seedBothListings() {
  // Reset here so each scenario starts clean, regardless of Background/hook ordering.
  world = createFakeWorld();
  await world.serviceListingRepository.create(
    fakeListing({ folio: 1016, providerName: 'Víctor Holguín', oficio: 'Jardinería', zonaCobertura: 'Campestre Washington', titulo: 'Diseño de jardines' }),
  );
  await world.serviceListingRepository.create(
    fakeListing({ folio: 1001, providerName: 'Raúl Chávez', oficio: 'Electricidad', zonaCobertura: 'Centro', titulo: 'Instalación eléctrica' }),
  );
}

describeFeature(feature, ({ Background, Scenario }) => {
  Background(({ Given, And }) => {
    Given('hay publicaciones de "Víctor Holguín" (folio 1016, Jardinería, Campestre Washington)', async () => {
      await seedBothListings();
    });
    And('hay publicaciones de "Raúl Chávez" (folio 1001, Electricidad, Centro)', () => {
      // already seeded together above, so the two listings are created atomically
    });
  });

  Scenario('Buscar por nombre sin escribir acentos', ({ When, Then, And }) => {
    let results: ServiceListing[] = [];

    When('el cliente busca "victor holguin"', async () => {
      results = await world.serviceListingRepository.search({ q: 'victor holguin' });
    });

    Then('encuentra la publicación con folio 1016', () => {
      expect(results.some((r) => r.folio === 1016)).toBe(true);
    });

    And('no encuentra la publicación con folio 1001', () => {
      expect(results.some((r) => r.folio === 1001)).toBe(false);
    });
  });

  Scenario('Buscar por folio exacto', ({ When, Then, And }) => {
    let results: ServiceListing[] = [];

    When('el cliente busca "1001"', async () => {
      results = await world.serviceListingRepository.search({ q: '1001' });
    });

    Then('encuentra la publicación con folio 1001', () => {
      expect(results.some((r) => r.folio === 1001)).toBe(true);
    });

    And('no encuentra la publicación con folio 1016', () => {
      expect(results.some((r) => r.folio === 1016)).toBe(false);
    });
  });

  Scenario('Buscar por oficio sin texto libre', ({ When, Then, And }) => {
    let results: ServiceListing[] = [];

    When('el cliente filtra por el oficio "Jardinería"', async () => {
      results = await world.serviceListingRepository.search({ oficio: 'Jardinería' });
    });

    Then('encuentra la publicación con folio 1016', () => {
      expect(results.some((r) => r.folio === 1016)).toBe(true);
    });

    And('no encuentra la publicación con folio 1001', () => {
      expect(results.some((r) => r.folio === 1001)).toBe(false);
    });
  });

  Scenario('Una búsqueda sin coincidencias no revienta, solo regresa vacío', ({ When, Then }) => {
    let results: ServiceListing[] = [];

    When('el cliente busca "nadie se llama así"', async () => {
      results = await world.serviceListingRepository.search({ q: 'nadie se llama así' });
    });

    Then('no encuentra ninguna publicación', () => {
      expect(results).toHaveLength(0);
    });
  });
});
