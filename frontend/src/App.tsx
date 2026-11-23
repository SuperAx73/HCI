import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { RoleSwitch } from './components/RoleSwitch';
import { Sidebar } from './components/Sidebar';
import { Avatar } from './components/Avatar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ProviderProfilePage } from './pages/ProviderProfilePage';
import { AdminVerificationsPage } from './pages/AdminVerificationsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryListingsPage } from './pages/CategoryListingsPage';
import { MyListingsPage } from './pages/MyListingsPage';
import { MyProfilePage } from './pages/MyProfilePage';

function HomePage() {
  const { appUser } = useAuth();
  if (appUser?.activeRole === 'provider') return <Navigate to="/mis-publicaciones" replace />;
  return <CategoriesPage />;
}

export default function App() {
  const { appUser, logout } = useAuth();

  return (
    <div className="app-backdrop">
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      <div className="app-frame">
        <header className="app-topbar">
          <Link to="/" className="brand">
            Trato
          </Link>

          <nav className="pill-tabs" aria-label="Navegación principal">
            <NavLink to="/categorias" className={({ isActive }) => (isActive ? 'nav-active' : undefined)}>
              Buscar
            </NavLink>
            {appUser?.activeRole === 'provider' && (
              <NavLink to="/mis-publicaciones" className={({ isActive }) => (isActive ? 'nav-active' : undefined)}>
                Publicaciones
              </NavLink>
            )}
            {appUser && (
              <NavLink to="/perfil" className={({ isActive }) => (isActive ? 'nav-active' : undefined)}>
                Mi perfil
              </NavLink>
            )}
          </nav>

          <div className="topbar-cluster">
            {appUser && <RoleSwitch />}
            <AccessibilityToolbar />
            {!appUser && (
              <>
                <Link to="/login" className="icon-link">
                  Entrar
                </Link>
                <Link to="/registro" className="btn btn-primary btn-nav">
                  Crear cuenta
                </Link>
              </>
            )}
            {appUser && (
              <div className="account-cluster">
                <Avatar name={appUser.displayName} />
                <button className="icon-link" onClick={logout}>
                  Salir
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="app-body">
          <Sidebar />
          <main id="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registro" element={<RegisterPage />} />
              <Route path="/olvide-contrasena" element={<ForgotPasswordPage />} />
              <Route path="/restablecer-contrasena" element={<ResetPasswordPage />} />
              <Route path="/categorias" element={<CategoriesPage />} />
              <Route path="/categorias/:oficio" element={<CategoryListingsPage />} />
              <Route path="/buscar" element={<Navigate to="/categorias" replace />} />
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
        </div>
      </div>
    </div>
  );
}
