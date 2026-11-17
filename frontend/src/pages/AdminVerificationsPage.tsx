import { useEffect, useState } from 'react';
import type { VerificationRequest } from '@oficios/shared';
import { api } from '../api/client';
import { Button } from '../components/Button';

export function AdminVerificationsPage() {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setRequests(await api.get<VerificationRequest[]>('/admin/verifications/pending'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function review(requestId: string, decision: 'approved' | 'rejected') {
    await api.post(`/admin/verifications/${requestId}/review`, { decision });
    await load();
  }

  return (
    <main>
      <h1>Verificaciones pendientes</h1>
      <p className="page-intro">Revisa la identificación y la selfie antes de aprobar — esto es lo que respalda la confianza de todo el sistema.</p>
      {loading && <p>Cargando…</p>}
      {!loading && requests.length === 0 && <p className="empty-state">No hay solicitudes pendientes.</p>}
      <ul className="card-list">
        {requests.map((r) => (
          <li key={r.id} className="card">
            <h2>{r.displayName}</h2>
            <p className="card-meta">{r.uid}</p>
            <p>
              <a href={r.idPhotoUrl} target="_blank" rel="noreferrer">
                Ver identificación
              </a>{' '}
              ·{' '}
              <a href={r.selfiePhotoUrl} target="_blank" rel="noreferrer">
                Ver selfie
              </a>
            </p>
            <Button variant="primary" onClick={() => review(r.id, 'approved')}>
              Aprobar
            </Button>{' '}
            <Button variant="danger" onClick={() => review(r.id, 'rejected')}>
              Rechazar
            </Button>
          </li>
        ))}
      </ul>
    </main>
  );
}
