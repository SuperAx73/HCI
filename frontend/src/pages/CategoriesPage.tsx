import { Link } from 'react-router-dom';
import { OFICIOS } from '@oficios/shared';
import { OficioIcon } from '../components/OficioIcon';
import { SearchHero } from '../components/SearchHero';
import { TrustStats } from '../components/TrustStats';
import { FeaturedProviders } from '../components/FeaturedProviders';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { FaqSection } from '../components/FaqSection';

export function CategoriesPage() {
  return (
    <div className="home-page">
      <SearchHero />
      <TrustStats />

      <section className="categories-section" aria-label="Categorías de oficios">
        <div className="section-heading">
          <h2>¿Qué servicio necesitas?</h2>
          <p className="page-intro">Elige una categoría para ver a las personas verificadas que ofrecen ese servicio.</p>
        </div>
        <ul className="card-list category-grid">
          {OFICIOS.map((oficio, i) => (
            <li
              key={oficio}
              className={`card category-card category-card-tint-${i % 5}`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <Link to={`/categorias/${encodeURIComponent(oficio)}`} className="category-card-link">
                <span className="oficio-icon oficio-icon-lg">
                  <OficioIcon oficio={oficio} width={32} height={32} />
                </span>
                <h2>{oficio}</h2>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <FeaturedProviders />
      <TestimonialsSection />
      <FaqSection />
    </div>
  );
}
