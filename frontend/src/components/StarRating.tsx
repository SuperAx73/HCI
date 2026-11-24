const STARS = [1, 2, 3, 4, 5];

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
}

/** Read-only by default; pass onChange to turn it into a 1-5 star picker. */
export function StarRating({ value, onChange, size = 18 }: StarRatingProps) {
  if (!onChange) {
    return (
      <span className="star-rating" role="img" aria-label={`${value} de 5 estrellas`}>
        {STARS.map((n) => (
          <span key={n} aria-hidden="true" className={n <= value ? 'star star-filled' : 'star'} style={{ fontSize: size }}>
            ★
          </span>
        ))}
      </span>
    );
  }

  return (
    <span className="star-rating star-rating-interactive" role="group" aria-label="Elige una calificación">
      {STARS.map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
          aria-pressed={value === n}
          className={n <= value ? 'star star-filled' : 'star'}
          style={{ fontSize: size }}
          onClick={() => onChange(n)}
        >
          ★
        </button>
      ))}
    </span>
  );
}
