import { useAccessibility } from '../context/AccessibilityContext';
import { ContrastIcon, SunIcon, MoonIcon } from './NavIcons';

const SIZES = [
  { value: 'normal', label: 'Tamaño de texto normal', short: 'A' },
  { value: 'large', label: 'Tamaño de texto grande', short: 'A+' },
  { value: 'xlarge', label: 'Tamaño de texto extra grande', short: 'A++' },
] as const;

export function AccessibilityToolbar() {
  const { fontSize, setFontSize, highContrast, setHighContrast, theme, toggleTheme } = useAccessibility();

  return (
    <div role="group" aria-label="Opciones de accesibilidad" className="a11y-toolbar">
      {SIZES.map((size) => (
        <button
          key={size.value}
          type="button"
          className={`icon-btn ${fontSize === size.value ? 'icon-btn-active' : ''}`}
          aria-pressed={fontSize === size.value}
          aria-label={size.label}
          onClick={() => setFontSize(size.value)}
        >
          {size.short}
        </button>
      ))}
      <button
        type="button"
        className={`icon-btn ${highContrast ? 'icon-btn-active' : ''}`}
        aria-pressed={highContrast}
        aria-label="Alto contraste"
        onClick={() => setHighContrast(!highContrast)}
      >
        <ContrastIcon width={15} height={15} />
        Contraste
      </button>
      <button
        type="button"
        className="icon-btn"
        aria-label={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
        onClick={toggleTheme}
      >
        {theme === 'light' ? <MoonIcon width={15} height={15} /> : <SunIcon width={15} height={15} />}
        {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
      </button>
    </div>
  );
}
