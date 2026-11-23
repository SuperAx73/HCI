import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';

export function ResetPasswordPage() {
  const { verifyResetCode, confirmPasswordReset } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get('oobCode') ?? '';

  const [status, setStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!oobCode) {
      setStatus('invalid');
      return;
    }
    verifyResetCode(oobCode)
      .then((resolvedEmail) => {
        setEmail(resolvedEmail);
        setStatus('valid');
      })
      .catch(() => setStatus('invalid'));
  }, [oobCode, verifyResetCode]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    try {
      await confirmPasswordReset(oobCode, password);
      navigate('/login', { replace: true });
    } catch {
      setError('No pudimos actualizar tu contraseña. Intenta solicitar un nuevo enlace.');
    }
  }

  if (status === 'checking') {
    return (
      <main>
        <h1>Restablecer contraseña</h1>
        <p>Verificando enlace…</p>
      </main>
    );
  }

  if (status === 'invalid') {
    return (
      <main>
        <h1>Enlace inválido o vencido</h1>
        <p className="page-intro">Este enlace de recuperación ya no es válido. Solicita uno nuevo.</p>
        <Link to="/olvide-contrasena" className="btn btn-primary">
          Pedir nuevo enlace
        </Link>
      </main>
    );
  }

  return (
    <main>
      <h1>Crea una nueva contraseña</h1>
      <p className="page-intro">
        Estás restableciendo la contraseña de <strong>{email}</strong>.
      </p>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Nueva contraseña"
          type="password"
          required
          minLength={6}
          hint="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Confirma tu nueva contraseña"
          type="password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && (
          <p role="alert" className="text-field-error">
            {error}
          </p>
        )}
        <Button type="submit">Guardar nueva contraseña</Button>
      </form>
    </main>
  );
}
