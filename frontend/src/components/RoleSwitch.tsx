import { useAuth } from '../context/AuthContext';
import { useProviderEligibility } from '../hooks/useProviderEligibility';

/**
 * Lets a logged-in account toggle between the 'client' and 'provider' views.
 * The provider option is disabled until the backend eligibility check
 * (providerEligibility.service.ts) reports eligible: true.
 */
export function RoleSwitch() {
  const { appUser, switchActiveRole } = useAuth();
  const { eligibility, loading } = useProviderEligibility(!!appUser);

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
      <div className="pill-toggle">
        <button
          type="button"
          className={appUser.activeRole === 'client' ? 'pill-toggle-active' : ''}
          onClick={() => switchActiveRole('client')}
          aria-pressed={appUser.activeRole === 'client'}
        >
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
          Prestador
        </button>
      </div>
      {hint && <p className="role-switch-hint">{hint}</p>}
    </div>
  );
}
