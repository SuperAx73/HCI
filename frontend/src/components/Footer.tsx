import { Link } from 'react-router-dom';
import { OFICIOS } from '@oficios/shared';
import { BrandLogo } from './BrandLogo';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <span className="brand">
            <BrandLogo />
            <span className="brand-word">
              ofi<span className="brand-accent">s</span>
            </span>
          </span>
          <p className="footer-tagline">Oficios de confianza, verificados antes de publicar.</p>
        </div>

        <div className="footer-col">
          <p className="footer-col-title">Oficios</p>
          <ul>
            {OFICIOS.slice(0, 5).map((oficio) => (
              <li key={oficio}>
                <Link to={`/categorias/${encodeURIComponent(oficio)}`}>{oficio}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <p className="footer-col-title">Para clientes</p>
          <ul>
            <li>
              <Link to="/categorias">Buscar servicios</Link>
            </li>
            <li>
              <Link to="/registro">Crear cuenta</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <p className="footer-col-title">Para prestadores</p>
          <ul>
            <li>
              <Link to="/registro">Publicar un servicio</Link>
            </li>
            <li>
              <Link to="/perfil-prestador">Completar verificación</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ofis — oficios de confianza. Proyecto académico.</p>
      </div>
    </footer>
  );
}
