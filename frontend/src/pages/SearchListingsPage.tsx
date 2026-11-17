import { useState } from 'react';
import { OFICIOS } from '@oficios/shared';
import { useSearchListings } from '../hooks/useServiceListings';
import { TextField } from '../components/TextField';
import { Select } from '../components/Select';
import { TrustBadge } from '../components/TrustBadge';
import { OficioIcon } from '../components/OficioIcon';
import { MOCK_LISTINGS } from '../mocks/listings';

export function SearchListingsPage() {
  const [oficio, setOficio] = useState('');
  const [zonaCobertura, setZonaCobertura] = useState('');
  const { listings, loading } = useSearchListings({ oficio: oficio || undefined, zonaCobertura: zonaCobertura || undefined });

  const showingMocks = import.meta.env.DEV && !loading && listings.length === 0 && !oficio && !zonaCobertura;
  const visibleListings = showingMocks ? MOCK_LISTINGS : listings;

  return (
    <main>
      <h1>Encuentra a alguien de confianza</h1>
      <p className="page-intro">
        Toda persona que publica aquí ya pasó por verificación de identidad.
      </p>
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <Select label="Oficio" value={oficio} onChange={(e) => setOficio(e.target.value)}>
          <option value="">Todos los oficios</option>
          {OFICIOS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </Select>
        <TextField label="Zona" placeholder="Colonia o parte de la ciudad" value={zonaCobertura} onChange={(e) => setZonaCobertura(e.target.value)} />
      </form>

      {loading && <p>Buscando…</p>}
      {!loading && listings.length === 0 && !showingMocks && (
        <p className="empty-state">Todavía no hay publicaciones para esa búsqueda. Intenta con otro oficio o zona.</p>
      )}
      {showingMocks && (
        <p className="preview-note" role="note">
          Vista previa con datos de ejemplo — todavía no hay publicaciones reales.
        </p>
      )}
      <ul className="card-list">
        {visibleListings.map((l, i) => (
          <li key={l.id} className="card" style={{ animationDelay: `${i * 60}ms` }}>
            <TrustBadge />
            <div className="card-title-row">
              <span className="oficio-icon">
                <OficioIcon oficio={l.oficio} />
              </span>
              <h2>{l.titulo}</h2>
            </div>
            <p className="card-meta">
              {l.oficio} · {l.zonaCobertura}
            </p>
            <p>{l.descripcion}</p>
            <p className="card-price">Precio de referencia: ${l.precioReferencia} MXN</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
