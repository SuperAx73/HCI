import { Link } from 'react-router-dom';
import { useSearchListings } from '../hooks/useServiceListings';
import { ListingPreviewCard } from './ListingPreviewCard';

const MAX_FEATURED = 8;

export function FeaturedProviders() {
  const { listings, loading } = useSearchListings({});
  const featured = listings.slice(0, MAX_FEATURED);

  if (!loading && featured.length === 0) return null;

  return (
    <section className="featured-providers" aria-label="Prestadores destacados">
      <div className="section-heading">
        <h2>Prestadores destacados</h2>
      </div>
      <div className="featured-scroll">
        {loading &&
          [0, 1, 2].map((i) => (
            <div key={i} className="featured-item card skeleton-card" aria-hidden="true" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="skeleton-line skeleton-line-title" />
              <div className="skeleton-line skeleton-line-meta" />
              <div className="skeleton-line skeleton-line-text" />
              <div className="skeleton-line skeleton-line-text" />
            </div>
          ))}
        {!loading &&
          featured.map((l, i) => (
            <div key={l.id} className="featured-item" style={{ animationDelay: `${i * 80}ms` }}>
              <Link to={`/prestadores/${l.folio}`} className="card-link-overlay" aria-label={`Ver perfil de ${l.providerName}`} />
              <ListingPreviewCard
                titulo={l.titulo}
                oficio={l.oficio}
                zonaCobertura={l.zonaCobertura}
                descripcion={l.descripcion}
                precioReferencia={l.precioReferencia}
                providerName={l.providerName}
                folio={l.folio}
              />
            </div>
          ))}
      </div>
    </section>
  );
}
