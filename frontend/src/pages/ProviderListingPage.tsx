import { Link, useParams } from 'react-router-dom';
import { useListingByFolio } from '../hooks/useServiceListings';
import { TrustBadge } from '../components/TrustBadge';
import { OficioIcon } from '../components/OficioIcon';
import { Avatar } from '../components/Avatar';
import { ReviewsSection } from '../components/ReviewsSection';

function formatPhone(telefono: string) {
  const digits = telefono.replace(/\D/g, '');
  if (digits.length !== 10) return telefono;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

export function ProviderListingPage() {
  const { folio: folioParam } = useParams<{ folio: string }>();
  const folio = folioParam ? Number(folioParam) : undefined;
  const { listing, loading, notFound } = useListingByFolio(folio);

  if (loading) {
    return (
      <main>
        <div className="card skeleton-card" aria-hidden="true" style={{ maxWidth: 720 }}>
          <div className="skeleton-line skeleton-line-title" />
          <div className="skeleton-line skeleton-line-meta" />
          <div className="skeleton-line skeleton-line-text" />
          <div className="skeleton-line skeleton-line-text" />
        </div>
      </main>
    );
  }

  if (notFound || !listing) {
    return (
      <main>
        <p className="breadcrumb">
          <Link to="/categorias">← Todas las categorías</Link>
        </p>
        <p className="empty-state">No encontramos una publicación con ese folio.</p>
      </main>
    );
  }

  const cover = listing.fotos[0];

  return (
    <div className="provider-page">
      <div className="provider-cover" style={cover ? { backgroundImage: `url(${cover})` } : undefined}>
        <div className="provider-cover-scrim" />
        <div className="provider-cover-content">
          <p className="breadcrumb breadcrumb-on-cover">
            <Link to={`/categorias/${encodeURIComponent(listing.oficio)}`}>← Volver a resultados</Link>
          </p>
          <div className="provider-cover-identity">
            <Avatar name={listing.providerName} />
            <div>
              <h1>{listing.providerName}</h1>
              <p className="provider-cover-meta">
                <span className="oficio-icon">
                  <OficioIcon oficio={listing.oficio} width={16} height={16} />
                </span>
                {listing.oficio} · {listing.zonaCobertura}
              </p>
            </div>
          </div>
          <div className="provider-cover-badges">
            <TrustBadge />
            <span className="card-folio">Folio #{listing.folio}</span>
          </div>
        </div>
      </div>

      <div className="provider-body">
        <article className="provider-main">
          <h2>{listing.titulo}</h2>
          <p>{listing.descripcion}</p>

          {listing.fotos.length > 0 && (
            <>
              <h3>Fotos de su trabajo</h3>
              <ul className="provider-listing-gallery">
                {listing.fotos.map((url) => (
                  <li key={url}>
                    <img src={url} alt={`Trabajo de ${listing.providerName}`} loading="lazy" />
                  </li>
                ))}
              </ul>
            </>
          )}

          <ReviewsSection listingId={listing.id} providerUid={listing.providerUid} />
        </article>

        <aside className="provider-sidebar">
          <div className="card provider-contact-card">
            <p className="provider-contact-label">Precio de referencia</p>
            <p className="provider-contact-price">${listing.precioReferencia} MXN</p>

            {listing.telefono && (
              <div className="provider-listing-contact">
                <a href={`tel:+52${listing.telefono}`} className="btn btn-cta">
                  {formatPhone(listing.telefono)}
                </a>
                <a
                  href={`https://wa.me/52${listing.telefono}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                >
                  WhatsApp
                </a>
              </div>
            )}

            <p className="provider-contact-hint">Toda persona que publica aquí ya pasó por verificación de identidad.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
