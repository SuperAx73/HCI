import { useAccessibility } from '../context/AccessibilityContext';

export function BrandLogo({ className }: { className?: string }) {
  const { theme } = useAccessibility();
  const src = theme === 'dark' ? '/logo-dark-icon.png' : '/logo-light-icon.png';

  return <img src={src} alt="" aria-hidden="true" className={`brand-mark${className ? ` ${className}` : ''}`} />;
}
