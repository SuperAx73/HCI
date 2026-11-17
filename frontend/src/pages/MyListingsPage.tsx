import { useState, type FormEvent } from 'react';
import { OFICIOS } from '@oficios/shared';
import { useMyListings } from '../hooks/useServiceListings';
import { api } from '../api/client';
import { TextField } from '../components/TextField';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { OficioIcon } from '../components/OficioIcon';
import { ListingPreviewCard } from '../components/ListingPreviewCard';

export function MyListingsPage() {
  const { listings, loading, refresh } = useMyListings();
  const [form, setForm] = useState({ oficio: OFICIOS[0] as string, titulo: '', descripcion: '', zonaCobertura: '', precioReferencia: 0 });
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/listings', { ...form, fotos: [] });
      await refresh();
      setForm({ oficio: OFICIOS[0], titulo: '', descripcion: '', zonaCobertura: '', precioReferencia: 0 });
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main>
      <h1>Mis publicaciones</h1>
      <p className="page-intro">Lo que publiques aquí lo verá cualquier cliente que busque tu oficio y zona.</p>

      <div className="publish-layout">
        <div className="publish-form-col">
          <fieldset>
            <legend>Publicar nuevo servicio</legend>
            <form onSubmit={handleSubmit}>
              <TextField label="Título" placeholder="Ej. Instalación y reparación eléctrica" required value={form.titulo} onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))} />
              <Select label="Oficio" value={form.oficio} onChange={(e) => setForm((f) => ({ ...f, oficio: e.target.value }))}>
                {OFICIOS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </Select>
              <TextField label="Zona de cobertura" required value={form.zonaCobertura} onChange={(e) => setForm((f) => ({ ...f, zonaCobertura: e.target.value }))} />
              <TextField label="Descripción" required value={form.descripcion} onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))} />
              <TextField label="Precio de referencia (MXN)" type="number" required value={form.precioReferencia} onChange={(e) => setForm((f) => ({ ...f, precioReferencia: Number(e.target.value) }))} />
              {error && <p role="alert" className="text-field-error">{error}</p>}
              <Button type="submit">Publicar</Button>
            </form>
          </fieldset>
        </div>

        <div className="publish-preview-col">
          <p className="publish-preview-label">Así se verá tu publicación</p>
          <ListingPreviewCard
            titulo={form.titulo}
            oficio={form.oficio}
            zonaCobertura={form.zonaCobertura}
            descripcion={form.descripcion}
            precioReferencia={form.precioReferencia}
          />
        </div>
      </div>

      {loading && <p>Cargando…</p>}
      {!loading && listings.length === 0 && <p className="empty-state">Todavía no has publicado ningún servicio.</p>}
      <ul className="card-list">
        {listings.map((l) => (
          <li key={l.id} className="card">
            <div className="card-title-row">
              <span className="oficio-icon">
                <OficioIcon oficio={l.oficio} />
              </span>
              <h3>{l.titulo}</h3>
            </div>
            <p className="card-meta">{l.oficio} · {l.zonaCobertura}</p>
            <p className="card-price">${l.precioReferencia} MXN</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
