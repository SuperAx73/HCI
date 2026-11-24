import { describe, expect, it } from 'vitest';
import { normalizeSearchText } from '../search';

describe('normalizeSearchText', () => {
  it('lowercases text', () => {
    expect(normalizeSearchText('Raúl CHÁVEZ')).toBe('raul chavez');
  });

  it('strips accents so a client can search without typing them', () => {
    expect(normalizeSearchText('Chávez')).toBe('chavez');
    expect(normalizeSearchText('Jardinería')).toBe('jardineria');
    expect(normalizeSearchText('Electrodomésticos')).toBe('electrodomesticos');
  });

  it('lets an accent-free query match accented stored text', () => {
    const stored = normalizeSearchText('Víctor Holguín');
    const query = normalizeSearchText('victor holguin');
    expect(stored.includes(query)).toBe(true);
  });

  it('leaves plain ascii untouched other than casing', () => {
    expect(normalizeSearchText('Plomero 1005')).toBe('plomero 1005');
  });
});
