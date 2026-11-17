import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';

export interface EligibilityResult {
  eligible: boolean;
  profileComplete: boolean;
  verificationApproved: boolean;
  missingFields: string[];
}

/**
 * Thin client over the backend's single source of truth
 * (providerEligibility.service.ts). Never re-derive eligibility here.
 */
export function useProviderEligibility(enabled: boolean) {
  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const result = await api.get<EligibilityResult>('/providers/eligibility');
      setEligibility(result);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { eligibility, loading, refresh };
}
