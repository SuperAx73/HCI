import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../hooks/useReviews';
import { StarRating } from './StarRating';
import { Avatar } from './Avatar';
import { Button } from '../components/Button';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function ReviewsSection({ listingId, providerUid }: { listingId: string; providerUid: string }) {
  const { appUser } = useAuth();
  const { reviews, loading, submit } = useReviews(listingId);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const average = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  const myReview = appUser ? reviews.find((r) => r.authorUid === appUser.uid) : undefined;
  const isOwner = appUser?.uid === providerUid;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setStatus('Elige una calificación antes de enviar.');
      return;
    }
    setSubmitting(true);
    setStatus(null);
    try {
      await submit({ rating, comment });
      setStatus('¡Gracias por tu reseña!');
      setComment('');
      setRating(0);
    } catch (err) {
      setStatus((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="reviews-section" aria-label="Reseñas">
      <div className="reviews-heading">
        <h2>Reseñas</h2>
        {reviews.length > 0 && (
          <div className="reviews-summary">
            <StarRating value={Math.round(average)} />
            <span>
              {average.toFixed(1)} · {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
            </span>
          </div>
        )}
      </div>

      {loading && <p>Cargando reseñas…</p>}
      {!loading && reviews.length === 0 && <p className="empty-state">Todavía no hay reseñas para esta publicación.</p>}

      {!loading && reviews.length > 0 && (
        <ul className="review-list">
          {reviews.map((r) => (
            <li key={r.id} className="review-item">
              <Avatar name={r.authorName} />
              <div>
                <div className="review-item-head">
                  <p className="review-author">{r.authorName}</p>
                  <StarRating value={r.rating} size={14} />
                </div>
                <p className="review-date">{formatDate(r.createdAt)}</p>
                <p className="review-comment">{r.comment}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {appUser && !isOwner && (
        <form className="review-form" onSubmit={handleSubmit}>
          <p className="review-form-title">{myReview ? 'Edita tu reseña' : 'Deja tu reseña'}</p>
          <StarRating value={rating || myReview?.rating || 0} onChange={setRating} size={24} />
          <textarea
            value={comment || myReview?.comment || ''}
            onChange={(e) => setComment(e.target.value)}
            placeholder="¿Cómo fue tu experiencia con este servicio?"
            rows={3}
            required
          />
          <Button type="submit" disabled={submitting}>
            {myReview ? 'Actualizar reseña' : 'Publicar reseña'}
          </Button>
          {status && <p role="status">{status}</p>}
        </form>
      )}

      {!appUser && <p className="page-intro">Inicia sesión para dejar una reseña.</p>}
    </section>
  );
}
