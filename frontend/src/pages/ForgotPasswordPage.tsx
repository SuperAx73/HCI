import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';

export function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await requestPasswordReset(email);
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code !== 'auth/user-not-found') {
        setError('No pudimos enviar el enlace. Revisa el correo e intenta de nuevo.');
        return;
      }
    }
    setSent(true);
  }

  if (sent) {
    return (
      <main>
        <h1>Revisa tu correo</h1>
        <p className="page-intro">
          Si el correo <strong>{email}</strong> está registrado, te enviamos un enlace para restablecer tu
          contraseña. Puede tardar unos minutos en llegar.
        </p>
        <Link to="/login" className="btn btn-secondary">
          Volver a iniciar sesión
        </Link>
      </main>
    );
  }

  return (
    <main>
      <h1>¿Olvidaste tu contraseña?</h1>
      <p className="page-intro">Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.</p>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Correo electrónico"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && (
          <p role="alert" className="text-field-error">
            {error}
          </p>
        )}
        <Button type="submit">Enviar enlace de recuperación</Button>
      </form>
      <p>
        <Link to="/login">Volver a iniciar sesión</Link>
      </p>
    </main>
  );
}
