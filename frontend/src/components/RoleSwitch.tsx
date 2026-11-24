import { useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProviderEligibility } from '../hooks/useProviderEligibility';
import { useSlidingIndicator } from '../hooks/useSlidingIndicator';
import { UserIcon, WrenchIcon } from './NavIcons';

/**
 * Lets a logged-in account toggle between the 'client' and 'provider' views.
 * The provider option is disabled until the backend eligibility check
 * (providerEligibility.service.ts) reports eligible: true.
 */
export function RoleSwitch() {
  const { appUser, switchActiveRole } = useAuth();
  const { eligibility, loading } = useProviderEligibility(!!appUser);
  const toggleRef = useRef<HTMLDivElement>(null);
  useSlidingIndicator(toggleRef, '.pill-toggle-active', [appUser?.activeRole]);

  if (!appUser) return null;

  const providerEnabled = appUser.roles.provider;
  const hint =
    !providerEnabled && !loading && eligibility
      ? eligibility.missingFields.length > 0
        ? `Falta completar: ${eligibility.missingFields.join(', ')}.`
        : !eligibility.verificationApproved
          ? 'Tu identidad aún no ha sido aprobada.'
          : null
      : null;

  return (
    <div role="group" aria-label="Cambiar tipo de perfil" className="role-switch">
      <div ref={toggleRef} className="pill-toggle">
        <span className="pill-indicator pill-indicator-accent" aria-hidden="true" />
        <button
          type="button"
          className={appUser.activeRole === 'client' ? 'pill-toggle-active' : ''}
          onClick={() => switchActiveRole('client')}
          aria-pressed={appUser.activeRole === 'client'}
        >
          <UserIcon width={15} height={15} />
          Cliente
        </button>
        <button
          type="button"
          className={appUser.activeRole === 'provider' ? 'pill-toggle-active' : ''}
          onClick={() => switchActiveRole('provider')}
          aria-pressed={appUser.activeRole === 'provider'}
          disabled={!providerEnabled}
          title={!providerEnabled ? 'Completa tu perfil y verificación para activar este modo' : undefined}
        >
          <WrenchIcon width={15} height={15} />
          Prestador
        </button>
      </div>
      {hint && <p className="role-switch-hint">{hint}</p>}
    </div>
  );
}
