import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  confirmPasswordReset as firebaseConfirmPasswordReset,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  verifyPasswordResetCode,
  type User as FirebaseUser,
} from 'firebase/auth';
import type { AppUser, UserRole } from '@oficios/shared';
import { auth } from '../lib/firebase';
import { api } from '../api/client';

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  appUser: AppUser | null;
  loading: boolean;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAppUser: () => Promise<void>;
  switchActiveRole: (role: UserRole) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  verifyResetCode: (oobCode: string) => Promise<string>;
  confirmPasswordReset: (oobCode: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshAppUser() {
    try {
      const user = await api.get<AppUser>('/auth/me');
      setAppUser(user);
    } catch {
      setAppUser(null);
    }
  }

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        await refreshAppUser();
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });
  }, []);

  async function register(email: string, password: string, displayName: string) {
    await createUserWithEmailAndPassword(auth, email, password);
    const user = await api.post<AppUser>('/auth/register', { email, displayName });
    setAppUser(user);
  }

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
    await refreshAppUser();
  }

  async function logout() {
    await firebaseSignOut(auth);
    setAppUser(null);
  }

  async function switchActiveRole(role: UserRole) {
    const user = await api.post<AppUser>('/auth/switch-role', { role });
    setAppUser(user);
  }

  async function requestPasswordReset(email: string) {
    await sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/restablecer-contrasena`,
      handleCodeInApp: true,
    });
  }

  async function verifyResetCode(oobCode: string) {
    return verifyPasswordResetCode(auth, oobCode);
  }

  async function confirmPasswordReset(oobCode: string, newPassword: string) {
    await firebaseConfirmPasswordReset(auth, oobCode, newPassword);
  }

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        appUser,
        loading,
        register,
        login,
        logout,
        refreshAppUser,
        switchActiveRole,
        requestPasswordReset,
        verifyResetCode,
        confirmPasswordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
