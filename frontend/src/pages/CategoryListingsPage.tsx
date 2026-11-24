import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { OFICIOS } from '@oficios/shared';
import { useSearchListings } from '../hooks/useServiceListings';
import { TextField } from '../components/TextField';
import { Select } from '../components/Select';
import { TrustBadge } from '../components/TrustBadge';
import { OficioIcon } from '../components/OficioIcon';

export function CategoryListingsPage() {
  const { oficio: oficioParam } = useParams<{ oficio: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oficio = oficioParam ? decodeURIComponent(oficioParam) : '';
  const [zonaCobertura, setZonaCobertura] = useState('');
  const [q, setQ] = useState(searchParams.get('q') ?? '');
  const { listings, loading } = useSearchListings({
    oficio: oficio || undefined,
    zonaCobertura: zonaCobertura || undefined,
    q: q || undefined,
  });

  function handleOficioChange(nextOficio: string) {
    if (nextOficio) {
      navigate(`/categorias/${encodeURIComponent(nextOficio)}`, { replace: true });
    } else {
      navigate('/buscar');
    }
  }

  return (
    <main>
      <p className="breadcrumb">
        <Link to="/categorias">← Todas las categorías</Link>
      </p>
      <h1>{oficio ? oficio : q ? `Resultados para “${q}”` : 'Encuentra a alguien de confianza'}</h1>
      <p className="page-intro">Toda persona que publica aquí ya pasó por verificación de identidad.</p>
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <Select label="Oficio" value={oficio} onChange={(e) => handleOficioChange(e.target.value)}>
          <option value="">Todos los oficios</option>
          {OFICIOS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </Select>
        <TextField label="Zona" placeholder="Colonia o parte de la ciudad" value={zonaCobertura} onChange={(e) => setZonaCobertura(e.target.value)} />
        <TextField
          label="Nombre o folio"
          placeholder="Nombre del prestador o # de folio"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </form>

      {loading && (
        <ul className="card-list" aria-busy="true" aria-live="polite">
          <li className="visually-hidden">Buscando…</li>
          {[0, 1, 2].map((i) => (
            <li key={i} className="card skeleton-card" aria-hidden="true" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="skeleton-line skeleton-line-title" />
              <div className="skeleton-line skeleton-line-meta" />
              <div className="skeleton-line skeleton-line-text" />
              <div className="skeleton-line skeleton-line-text" />
            </li>
          ))}
        </ul>
      )}
      {!loading && listings.length === 0 && (
        <p className="empty-state">Todavía no hay publicaciones para esa búsqueda. Intenta con otro oficio, zona, nombre o folio.</p>
      )}
      <ul className="card-list">
        {listings.map((l, i) => (
          <li key={l.id} className="card" style={{ animationDelay: `${i * 60}ms` }}>
            <Link to={`/prestadores/${l.folio}`} className="card-link-overlay" aria-label={`Ver perfil de ${l.providerName}`} />
            <div className="card-top-row">
              <TrustBadge />
              <span className="card-folio">Folio #{l.folio}</span>
            </div>
            <div className="card-title-row">
              <span className="oficio-icon">
                <OficioIcon oficio={l.oficio} />
              </span>
              <h2>{l.titulo}</h2>
            </div>
            <p className="card-provider">Por {l.providerName}</p>
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
