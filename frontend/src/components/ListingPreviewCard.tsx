import { OficioIcon } from './OficioIcon';
import { TrustBadge } from './TrustBadge';

interface ListingPreviewCardProps {
  titulo: string;
  oficio: string;
  zonaCobertura: string;
  descripcion: string;
  precioReferencia: number | string;
}

/** Live preview of how a listing/profile will look to clients in /categorias/:oficio, driven by in-progress form state. */
export function ListingPreviewCard({ titulo, oficio, zonaCobertura, descripcion, precioReferencia }: ListingPreviewCardProps) {
  return (
    <div className="card preview-card">
      <TrustBadge />
      <div className="card-title-row">
        <span className="oficio-icon">
          <OficioIcon oficio={oficio} />
        </span>
        <h2>{titulo || 'Título de tu servicio'}</h2>
      </div>
      <p className="card-meta">
        {oficio} · {zonaCobertura || 'Zona de cobertura'}
      </p>
      <p>{descripcion || 'Describe tu experiencia para que los clientes sepan qué esperar.'}</p>
      <p className="card-price">
        Precio de referencia: ${precioReferencia || 0} MXN
      </p>
    </div>
  );
}
