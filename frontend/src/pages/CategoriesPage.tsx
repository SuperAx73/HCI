import { Link } from 'react-router-dom';
import { OFICIOS } from '@oficios/shared';
import { OficioIcon } from '../components/OficioIcon';

export function CategoriesPage() {
  return (
    <main>
      <h1>¿Qué servicio necesitas?</h1>
      <p className="page-intro">Elige una categoría para ver a las personas verificadas que ofrecen ese servicio.</p>
      <ul className="card-list category-grid">
        {OFICIOS.map((oficio, i) => (
          <li key={oficio} className="card category-card" style={{ animationDelay: `${i * 60}ms` }}>
            <Link to={`/categorias/${encodeURIComponent(oficio)}`} className="category-card-link">
              <span className="oficio-icon oficio-icon-lg">
                <OficioIcon oficio={oficio} width={32} height={32} />
              </span>
              <h2>{oficio}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
