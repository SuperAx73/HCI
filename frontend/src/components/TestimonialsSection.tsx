import { Avatar } from './Avatar';

const TESTIMONIALS = [
  {
    name: 'Marisol H.',
    role: 'Cliente · Chihuahua',
    quote: 'Encontré un electricista verificado el mismo día. Pude ver sus reseñas y el precio de referencia antes de escribirle.',
  },
  {
    name: 'Rodrigo T.',
    role: 'Prestador · Plomería',
    quote: 'Publicar fue simple y la insignia de verificación me ha ayudado a que la gente confíe más rápido en mi trabajo.',
  },
  {
    name: 'Ana L.',
    role: 'Cliente · Aldama',
    quote: 'Me gustó poder filtrar por zona y ver exactamente qué incluía el servicio antes de contactar a alguien.',
  },
];

export function TestimonialsSection() {
  return (
    <section className="testimonials" aria-label="Historias de confianza">
      <div className="section-heading">
        <h2>Historias de confianza</h2>
      </div>
      <ul className="testimonial-list">
        {TESTIMONIALS.map((t, i) => (
          <li key={t.name} className="card testimonial-card" style={{ animationDelay: `${i * 70}ms` }}>
            <p className="testimonial-quote">“{t.quote}”</p>
            <div className="testimonial-author">
              <Avatar name={t.name} />
              <div>
                <p className="testimonial-name">{t.name}</p>
                <p className="testimonial-role">{t.role}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
