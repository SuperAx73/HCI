import { describe, expect, it } from 'vitest';
import type { ProviderProfile } from '@oficios/shared';
import { evaluateProviderEligibility } from '../providerEligibility.service';

function profile(overrides: Partial<ProviderProfile> = {}): ProviderProfile {
  return {
    uid: 'provider-1',
    oficio: 'Electricidad',
    zonaCobertura: 'Centro',
    precioReferencia: 400,
    descripcion: 'Trabajo eléctrico residencial',
    fotosTrabajos: [],
    verification: { status: 'approved' },
    profileComplete: true,
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('evaluateProviderEligibility', () => {
  it('is not eligible when there is no profile at all (brand-new account)', () => {
    const result = evaluateProviderEligibility(null);
    expect(result.eligible).toBe(false);
    expect(result.profileComplete).toBe(false);
    expect(result.verificationApproved).toBe(false);
  });

  it('lists every required field that is still missing', () => {
    const incomplete = profile({ zonaCobertura: '', precioReferencia: 0, descripcion: '' });
    const result = evaluateProviderEligibility(incomplete);
    expect(result.missingFields).toEqual(expect.arrayContaining(['zonaCobertura', 'descripcion']));
    expect(result.profileComplete).toBe(false);
    expect(result.eligible).toBe(false);
  });

  it('treats precioReferencia 0 as missing (a free service makes no sense here)', () => {
    const result = evaluateProviderEligibility(profile({ precioReferencia: 0 }));
    expect(result.missingFields).toContain('precioReferencia');
  });

  it('is not eligible when the profile is complete but verification is only pending', () => {
    const result = evaluateProviderEligibility(profile({ verification: { status: 'pending' } }));
    expect(result.profileComplete).toBe(true);
    expect(result.verificationApproved).toBe(false);
    expect(result.eligible).toBe(false);
  });

  it('is not eligible when verification was rejected, even with a complete profile', () => {
    const result = evaluateProviderEligibility(profile({ verification: { status: 'rejected', rejectionReason: 'Foto borrosa' } }));
    expect(result.eligible).toBe(false);
  });

  it('is eligible only once the profile is complete AND verification is approved', () => {
    const result = evaluateProviderEligibility(profile());
    expect(result.profileComplete).toBe(true);
    expect(result.verificationApproved).toBe(true);
    expect(result.eligible).toBe(true);
    expect(result.missingFields).toHaveLength(0);
  });
});
