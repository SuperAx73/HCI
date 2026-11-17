import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { ProviderProfile } from '@oficios/shared';
import { useAuth } from '../context/AuthContext';
import { useProviderEligibility } from '../hooks/useProviderEligibility';
import { api } from '../api/client';
import { Avatar } from '../components/Avatar';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';
import { OficioIcon } from '../components/OficioIcon';

export function MyProfilePage() {
  const { appUser, refreshAppUser } = useAuth();
  const { eligibility } = useProviderEligibility(!!appUser?.roles.provider);
  const [providerProfile, setProviderProfile] = useState<ProviderProfile | null>(null);
  const [phoneNumber, setPhoneNumber] = useState(appUser?.phoneNumber ?? '');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (appUser?.roles.provider) {
      api.get<ProviderProfile | null>('/providers/profile').then(setProviderProfile);
    }
  }, [appUser?.roles.provider]);

  if (!appUser) return null;

  async function handleVerifyPhone(e: FormEvent) {
    e.preventDefault();
    setStatus('Verificando número…');
    await api.post('/auth/verify-phone', { phoneNumber });
    await refreshAppUser();
    setStatus('Número verificado.');
  }

  return (
    <main>
      <h1>Mi perfil</h1>

      <section className="profile-header">
        <Avatar name={appUser.displayName} />
        <div>
          <h2>{appUser.displayName}</h2>
          <p className="card-meta">{appUser.email}</p>
        </div>
      </section>

      <fieldset>
        <legend>Datos de cliente</legend>
        <ul className="status-list">
          <li>Correo: {appUser.email}</li>
          <li>Teléfono: {appUser.phoneNumber ?? 'Sin registrar'} — {appUser.phoneVerified ? 'verificado' : 'sin verificar'}</li>
        </ul>
        {!appUser.phoneVerified && (
          <form onSubmit={handleVerifyPhone}>
            <TextField
              label="Número de teléfono"
              type="tel"
              required
              placeholder="614 000 0000"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button type="submit">Verificar número</Button>
          </form>
        )}
        {status && <p role="status">{status}</p>}
      </fieldset>

      <fieldset>
        <legend>Datos de prestador de servicios</legend>
        {!appUser.roles.provider && (
          <>
            <p>Todavía no has activado tu perfil de prestador de servicios.</p>
            <Link to="/perfil-prestador" className="btn btn-primary">
              Activar perfil de prestador
            </Link>
          </>
        )}
        {appUser.roles.provider && (
          <>
            {providerProfile && (
              <div className="card-title-row">
                <span className="oficio-icon">
                  <OficioIcon oficio={providerProfile.oficio} />
                </span>
                <h3>{providerProfile.oficio}</h3>
              </div>
            )}
            <ul className="status-list">
              <li>Zona de cobertura: {providerProfile?.zonaCobertura ?? '—'}</li>
              <li>Precio de referencia: {providerProfile ? `$${providerProfile.precioReferencia} MXN` : '—'}</li>
              <li>Identidad: {eligibility?.verificationApproved ? 'verificada' : 'pendiente de aprobación'}</li>
            </ul>
            <Link to="/perfil-prestador" className="btn btn-secondary">
              Editar datos de prestador
            </Link>
          </>
        )}
      </fieldset>
    </main>
  );
}
