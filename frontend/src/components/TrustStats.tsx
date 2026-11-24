const STATS = [
  { value: '100%', label: 'Identidad verificada antes de publicar' },
  { value: '10', label: 'Oficios de confianza disponibles' },
  { value: '0', label: 'Comisiones ocultas para contactar' },
];

export function TrustStats() {
  return (
    <section className="trust-stats" aria-label="Por qué confiar en ofis">
      {STATS.map((stat) => (
        <div key={stat.label} className="trust-stat">
          <span className="trust-stat-value">{stat.value}</span>
          <span className="trust-stat-label">{stat.label}</span>
        </div>
      ))}
    </section>
  );
}
