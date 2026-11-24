import { OficioIcon } from './OficioIcon';
import { TrustBadge } from './TrustBadge';

interface ListingPreviewCardProps {
  titulo: string;
  oficio: string;
  zonaCobertura: string;
  descripcion: string;
  precioReferencia: number | string;
  providerName?: string;
  folio?: number;
}

/** Live preview of how a listing/profile will look to clients in /categorias/:oficio, driven by in-progress form state. */
export function ListingPreviewCard({
  titulo,
  oficio,
  zonaCobertura,
  descripcion,
  precioReferencia,
  providerName,
  folio,
}: ListingPreviewCardProps) {
  return (
    <div className="card preview-card">
      <div className="card-top-row">
        <TrustBadge />
        <span className="card-folio">{folio ? `Folio #${folio}` : 'Folio se asigna al publicar'}</span>
      </div>
      <div className="card-title-row">
        <span className="oficio-icon">
          <OficioIcon oficio={oficio} />
        </span>
        <h2>{titulo || 'Título de tu servicio'}</h2>
      </div>
      {providerName && <p className="card-provider">Por {providerName}</p>}
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
