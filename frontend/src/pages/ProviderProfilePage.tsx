import { useEffect, useState, type FormEvent } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { OFICIOS, type ProviderProfile } from '@oficios/shared';
import { storage } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useProviderEligibility } from '../hooks/useProviderEligibility';
import { api } from '../api/client';
import { TextField } from '../components/TextField';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { OficioIcon } from '../components/OficioIcon';
import { ListingPreviewCard } from '../components/ListingPreviewCard';

export function ProviderProfilePage() {
  const { appUser } = useAuth();
  const { eligibility, refresh } = useProviderEligibility(!!appUser);
  const [profile, setProfile] = useState<Partial<ProviderProfile>>({});
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    api.get<ProviderProfile | null>('/providers/profile').then((p) => {
      if (p) setProfile(p);
    });
  }, []);

  async function handleSaveProfile(e: FormEvent) {
    e.preventDefault();
    setStatus('Guardando perfil…');
    await api.put('/providers/profile', {
      oficio: profile.oficio ?? '',
      zonaCobertura: profile.zonaCobertura ?? '',
      precioReferencia: profile.precioReferencia ?? 0,
      descripcion: profile.descripcion ?? '',
      fotosTrabajos: profile.fotosTrabajos ?? [],
    });
    await refresh();
    setStatus('Perfil guardado.');
  }

  async function handleSubmitVerification(e: FormEvent) {
    e.preventDefault();
    if (!appUser || !idFile || !selfieFile) return;
    setStatus('Subiendo documentos…');

    const idRef = ref(storage, `verification/${appUser.uid}/id-${Date.now()}`);
    const selfieRef = ref(storage, `verification/${appUser.uid}/selfie-${Date.now()}`);
    await uploadBytes(idRef, idFile);
    await uploadBytes(selfieRef, selfieFile);
    const idPhotoUrl = await getDownloadURL(idRef);
    const selfiePhotoUrl = await getDownloadURL(selfieRef);

    await api.post('/providers/verification', {
      displayName: appUser.displayName,
      idPhotoUrl,
      selfiePhotoUrl,
    });
    await refresh();
    setStatus('Documentos enviados. Un administrador revisará tu identidad.');
  }

  return (
    <main>
      <h1>Tu perfil de prestador</h1>
      <p className="page-intro">Completa tus datos y verifica tu identidad para poder publicar servicios.</p>

      <section aria-labelledby="eligibility-heading">
        <h2 id="eligibility-heading">Estado de activación</h2>
        {eligibility && (
          <ul className="status-list">
            <li>Perfil completo: {eligibility.profileComplete ? 'Sí' : 'No'}</li>
            <li>Identidad aprobada: {eligibility.verificationApproved ? 'Sí' : 'No'}</li>
            <li>
              <strong>Modo prestador {eligibility.eligible ? 'habilitado' : 'aún no habilitado'}</strong>
            </li>
          </ul>
        )}
      </section>

      <div className="publish-layout">
        <div className="publish-form-col">
          <fieldset>
            <legend>Datos del servicio</legend>
            <form onSubmit={handleSaveProfile}>
              <div className="oficio-select-row">
                <span className="oficio-icon">
                  <OficioIcon oficio={profile.oficio ?? OFICIOS[0]} />
                </span>
                <Select
                  label="Oficio"
                  required
                  value={profile.oficio ?? OFICIOS[0]}
                  onChange={(e) => setProfile((p) => ({ ...p, oficio: e.target.value }))}
                >
                  {OFICIOS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </Select>
              </div>
              <TextField
                label="Zona de cobertura"
                required
                value={profile.zonaCobertura ?? ''}
                onChange={(e) => setProfile((p) => ({ ...p, zonaCobertura: e.target.value }))}
              />
              <TextField
                label="Precio de referencia (MXN)"
                type="number"
                required
                value={profile.precioReferencia ?? ''}
                onChange={(e) => setProfile((p) => ({ ...p, precioReferencia: Number(e.target.value) }))}
              />
              <TextField
                label="Descripción de tu experiencia"
                required
                value={profile.descripcion ?? ''}
                onChange={(e) => setProfile((p) => ({ ...p, descripcion: e.target.value }))}
              />
              <Button type="submit">Guardar perfil</Button>
            </form>
          </fieldset>
        </div>

        <div className="publish-preview-col">
          <p className="publish-preview-label">Así te verán los clientes</p>
          <ListingPreviewCard
            titulo={appUser?.displayName ?? ''}
            oficio={profile.oficio ?? OFICIOS[0]}
            zonaCobertura={profile.zonaCobertura ?? ''}
            descripcion={profile.descripcion ?? ''}
            precioReferencia={profile.precioReferencia ?? 0}
          />
        </div>
      </div>

      <fieldset>
        <legend>Verificación de identidad</legend>
        <p>Sube una foto de tu identificación oficial y una selfie. Esta validación es obligatoria para publicar servicios.</p>
        <form onSubmit={handleSubmitVerification}>
          <div className="text-field">
            <label htmlFor="id-photo">Foto de identificación oficial</label>
            <input
              id="id-photo"
              type="file"
              accept="image/*"
              required
              onChange={(e) => setIdFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <div className="text-field">
            <label htmlFor="selfie-photo">Selfie</label>
            <input
              id="selfie-photo"
              type="file"
              accept="image/*"
              required
              onChange={(e) => setSelfieFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <Button type="submit">Enviar para revisión</Button>
        </form>
      </fieldset>

      {status && <p role="status">{status}</p>}
    </main>
  );
}
