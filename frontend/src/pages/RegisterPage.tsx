import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await register(email, password, displayName);
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main>
      <h1>Crea tu cuenta</h1>
      <p className="page-intro">Empiezas como cliente. Si ofreces un oficio, podrás activar tu perfil de prestador después de verificar tu identidad.</p>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Nombre completo"
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <TextField
          label="Correo electrónico"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Contraseña"
          type="password"
          required
          minLength={6}
          hint="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p role="alert" className="text-field-error">{error}</p>}
        <Button type="submit">Crear cuenta</Button>
      </form>
    </main>
  );
}
