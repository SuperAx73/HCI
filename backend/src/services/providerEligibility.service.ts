import { PROVIDER_PROFILE_REQUIRED_FIELDS, type ProviderProfile } from '@oficios/shared';

export interface EligibilityResult {
  eligible: boolean;
  profileComplete: boolean;
  verificationApproved: boolean;
  missingFields: string[];
}

/**
 * Single source of truth for whether an account may activate the 'provider' role.
 * Today: complete profile AND manually-approved identity verification.
 * If the team later decides approval isn't required, change the `eligible`
 * expression below only — no other module should re-implement this rule.
 */
export function evaluateProviderEligibility(profile: ProviderProfile | null): EligibilityResult {
  const missingFields = PROVIDER_PROFILE_REQUIRED_FIELDS.filter((field) => {
    const value = profile?.[field];
    return value === undefined || value === null || value === '';
  });

  const profileComplete = !!profile && missingFields.length === 0;
  const verificationApproved = profile?.verification.status === 'approved';

  return {
    eligible: profileComplete && verificationApproved,
    profileComplete,
    verificationApproved,
    missingFields,
  };
}
