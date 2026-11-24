import { useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OFICIOS } from '@oficios/shared';
import { OficioIcon } from './OficioIcon';

const TRENDING: string[] = ['Electricidad', 'Plomería', 'Limpieza'];

export function SearchHero() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const reduceMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return OFICIOS;
    return OFICIOS.filter((o) => o.toLowerCase().includes(q));
  }, [query]);

  function goTo(oficio: string) {
    setOpen(false);
    setQuery('');
    setActiveIndex(-1);
    navigate(`/categorias/${encodeURIComponent(oficio)}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const highlighted = activeIndex >= 0 ? matches[activeIndex] : undefined;
    if (highlighted) {
      goTo(highlighted);
      return;
    }
    const trimmed = query.trim();
    if (!trimmed) return;
    setOpen(false);
    navigate(`/buscar?q=${encodeURIComponent(trimmed)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, matches.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <section className="hero">
      <div className="hero-media" aria-hidden="true">
        {!reduceMotion && (
          <video className="hero-video" autoPlay loop muted playsInline preload="auto">
            <source src="/hero-loop.mp4" type="video/mp4" />
          </video>
        )}
        <div className="hero-scrim" />
      </div>

      <div className="hero-aurora" aria-hidden="true">
        <span className="hero-blob hero-blob-a" />
        <span className="hero-blob hero-blob-b" />
        <span className="hero-blob hero-blob-c" />
      </div>

      <div className="hero-content">
        <h1 className="hero-title">
          Encuentra a alguien <span className="hero-title-accent">de confianza</span> para el oficio que necesitas
        </h1>
        <p className="hero-subtitle">Cada persona que publica aquí ya pasó por verificación de identidad.</p>

        <form className="hero-search" role="search" onSubmit={handleSubmit}>
          <label htmlFor={listboxId} className="visually-hidden">
            Buscar un oficio
          </label>
          <div className="hero-search-box">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              id={listboxId}
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded={open}
              aria-autocomplete="list"
              aria-controls={`${listboxId}-listbox`}
              placeholder="Electricista, un nombre, o un folio…"
              value={query}
              onFocus={() => setOpen(true)}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
                setActiveIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              onBlur={() => setTimeout(() => setOpen(false), 120)}
              autoComplete="off"
            />
            <button type="submit" className="hero-search-submit">
              Buscar
            </button>
          </div>

          {open && (
            <ul id={`${listboxId}-listbox`} role="listbox" className="hero-suggestions">
              {matches.length === 0 && <li className="hero-suggestions-empty">Sin coincidencias. Prueba con “Otro”.</li>}
              {matches.map((oficio, i) => (
                <li key={oficio} role="option" aria-selected={activeIndex === i}>
                  <button
                    type="button"
                    className={activeIndex === i ? 'hero-suggestion-active' : undefined}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => goTo(oficio)}
                  >
                    <span className="oficio-icon">
                      <OficioIcon oficio={oficio} width={18} height={18} />
                    </span>
                    {oficio}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </form>

        <div className="hero-trending">
          <span className="hero-trending-label">Tendencia</span>
          {TRENDING.map((oficio) => (
            <button key={oficio} type="button" className="hero-chip" onClick={() => goTo(oficio)}>
              {oficio}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
