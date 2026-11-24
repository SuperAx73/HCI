import { describe, expect, it, vi } from 'vitest';
import type { ServiceListing } from '@oficios/shared';

// matchesQuery is pure and never touches Firestore, but importing the module that defines it
// still evaluates `../config/firebase` at the top — stub it out so the test doesn't need real
// Firebase credentials.
vi.mock('../../config/firebase', () => ({ db: {} }));

const { matchesQuery } = await import('../serviceListing.repository');

function listing(overrides: Partial<ServiceListing> = {}): ServiceListing {
  return {
    id: 'listing-1',
    folio: 1016,
    providerUid: 'provider-1',
    providerName: 'Victor Holguín',
    telefono: '6141445199',
    oficio: 'Jardinería',
    titulo: 'Diseño de jardines y riego automático',
    descripcion: 'Instalo sistemas de riego por goteo.',
    zonaCobertura: 'Campestre Washington',
    precioReferencia: 320,
    fotos: [],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('matchesQuery (client search)', () => {
  it('matches everything when there is no query — a client just browsing a category', () => {
    expect(matchesQuery(listing(), '')).toBe(true);
  });

  it('finds the provider by name without the client typing accents', () => {
    expect(matchesQuery(listing(), 'victor holguin')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(matchesQuery(listing(), 'VICTOR')).toBe(true);
  });

  it('finds the listing by its title', () => {
    expect(matchesQuery(listing(), 'riego automático')).toBe(true);
  });

  it('finds the listing by its exact folio', () => {
    expect(matchesQuery(listing(), '1016')).toBe(true);
  });

  it('does not match an unrelated folio number', () => {
    expect(matchesQuery(listing(), '1017')).toBe(false);
  });

  it('does not match an unrelated name', () => {
    expect(matchesQuery(listing(), 'Raúl Chávez')).toBe(false);
  });
});
