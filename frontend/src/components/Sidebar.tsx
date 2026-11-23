import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SidebarItem {
  to: string;
  label: string;
}

export function Sidebar() {
  const { appUser } = useAuth();

  const items: SidebarItem[] = [
    { to: '/categorias', label: 'Buscar servicios' },
    { to: '/perfil', label: 'Mi perfil' },
    ...(appUser?.activeRole === 'provider' ? [{ to: '/mis-publicaciones', label: 'Mis publicaciones' }] : []),
  ];

  return (
    <aside className="app-sidebar" aria-label="Navegación secundaria">
      <nav>
        <ul className="sidebar-nav">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {appUser && (
        <div className="sidebar-section">
          <p className="sidebar-section-title">Enlaces</p>
          <ul className="sidebar-nav">
            {appUser.roles.provider && (
              <li>
                <NavLink to="/perfil-prestador" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
                  Editar datos de prestador
                </NavLink>
              </li>
            )}
            {appUser.isAdmin && (
              <li>
                <NavLink to="/admin/verificaciones" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
                  Panel admin
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      )}
    </aside>
  );
}
