const FAQS = [
  {
    q: '¿Qué significa la insignia de verificación?',
    a: 'Que esa persona ya pasó por un proceso de verificación de identidad antes de poder publicar un servicio. Nunca mostramos solo un color: siempre va acompañada del texto "Identidad verificada".',
  },
  {
    q: '¿Cómo encuentro a alguien para mi zona?',
    a: 'Desde el buscador puedes filtrar por oficio y escribir tu colonia o zona de la ciudad. Los resultados se actualizan al instante.',
  },
  {
    q: '¿Puedo ofrecer mis servicios en ofis?',
    a: 'Sí. Crea una cuenta, completa tu verificación de identidad y cambia a modo "Prestador" para publicar tus servicios.',
  },
  {
    q: '¿Tiene algún costo contactar a un prestador?',
    a: 'No. Ver perfiles, precios de referencia y contactar a quien publica un servicio no tiene costo para quien busca ayuda.',
  },
];

export function FaqSection() {
  return (
    <section className="faq" aria-label="Preguntas frecuentes">
      <div className="section-heading">
        <h2>Preguntas frecuentes</h2>
      </div>
      <div className="faq-list">
        {FAQS.map((item) => (
          <details key={item.q} className="faq-item">
            <summary>
              {item.q}
              <span className="faq-icon" aria-hidden="true" />
            </summary>
            <div className="faq-answer">
              <p>{item.a}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
