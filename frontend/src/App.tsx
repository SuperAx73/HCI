import { useRef } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useScrolled } from './hooks/useScrolled';
import { useSlidingIndicator } from './hooks/useSlidingIndicator';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { RoleSwitch } from './components/RoleSwitch';
import { Avatar } from './components/Avatar';
import { BrandLogo } from './components/BrandLogo';
import { Footer } from './components/Footer';
import { SearchNavIcon, BriefcaseIcon, UserIcon, IdBadgeIcon, ShieldCheckIcon, LoginIcon, LogoutIcon, UserPlusIcon } from './components/NavIcons';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ProviderProfilePage } from './pages/ProviderProfilePage';
import { AdminVerificationsPage } from './pages/AdminVerificationsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryListingsPage } from './pages/CategoryListingsPage';
import { ProviderListingPage } from './pages/ProviderListingPage';
import { MyListingsPage } from './pages/MyListingsPage';
import { MyProfilePage } from './pages/MyProfilePage';

function HomePage() {
  const { appUser } = useAuth();
  if (appUser?.activeRole === 'provider') return <Navigate to="/mis-publicaciones" replace />;
  return <CategoriesPage />;
}

export default function App() {
  const { appUser, logout } = useAuth();
  const scrolled = useScrolled();
  const location = useLocation();
  const pillTabsRef = useRef<HTMLElement>(null);
  useSlidingIndicator(pillTabsRef, '.nav-active', [location.pathname, appUser?.activeRole, !!appUser]);

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      <header className={`app-topbar${scrolled ? ' app-topbar-scrolled' : ''}`}>
        <Link to="/" className="brand">
          <BrandLogo />
          <span className="brand-word">
            ofi<span className="brand-accent">s</span>
          </span>
        </Link>

        <nav ref={pillTabsRef} className="pill-tabs" aria-label="Navegación principal">
          <span className="pill-indicator" aria-hidden="true" />
          <NavLink to="/categorias" className={({ isActive }) => (isActive ? 'nav-active' : undefined)}>
            <SearchNavIcon />
            Buscar
          </NavLink>
          {appUser?.activeRole === 'provider' && (
            <NavLink to="/mis-publicaciones" className={({ isActive }) => (isActive ? 'nav-active' : undefined)}>
              <BriefcaseIcon />
              Publicaciones
            </NavLink>
          )}
          {appUser && (
            <NavLink to="/perfil" className={({ isActive }) => (isActive ? 'nav-active' : undefined)}>
              <UserIcon />
              Mi perfil
            </NavLink>
          )}
          {appUser?.roles.provider && (
            <NavLink to="/perfil-prestador" className={({ isActive }) => (isActive ? 'nav-active' : undefined)}>
              <IdBadgeIcon />
              Prestador
            </NavLink>
          )}
          {appUser?.isAdmin && (
            <NavLink to="/admin/verificaciones" className={({ isActive }) => (isActive ? 'nav-active' : undefined)}>
              <ShieldCheckIcon />
              Admin
            </NavLink>
          )}
        </nav>

        <div className="topbar-cluster">
          {appUser && <RoleSwitch />}
          <AccessibilityToolbar />
          {!appUser && (
            <>
              <Link to="/login" className="icon-link">
                <LoginIcon />
                Entrar
              </Link>
              <Link to="/registro" className="btn btn-cta btn-nav">
                <UserPlusIcon />
                Crear cuenta
              </Link>
            </>
          )}
          {appUser && (
            <div className="account-cluster">
              <Avatar name={appUser.displayName} />
              <button className="icon-link" onClick={logout}>
                <LogoutIcon />
                Salir
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="app-backdrop">
        <div className="app-frame">
          <main id="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registro" element={<RegisterPage />} />
              <Route path="/olvide-contrasena" element={<ForgotPasswordPage />} />
              <Route path="/restablecer-contrasena" element={<ResetPasswordPage />} />
              <Route path="/categorias" element={<CategoriesPage />} />
              <Route path="/categorias/:oficio" element={<CategoryListingsPage />} />
              <Route path="/buscar" element={<CategoryListingsPage />} />
              <Route path="/prestadores/:folio" element={<ProviderListingPage />} />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <MyProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mis-publicaciones"
                element={
                  <ProtectedRoute>
                    <MyListingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perfil-prestador"
                element={
                  <ProtectedRoute>
                    <ProviderProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/verificaciones"
                element={
                  <ProtectedRoute>
                    <AdminVerificationsPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
