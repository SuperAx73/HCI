import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type FontSize = 'normal' | 'large' | 'xlarge';
type Theme = 'light' | 'dark';

interface AccessibilityContextValue {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  theme: Theme;
  setTheme: (value: Theme) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = 'oficios:accessibility';

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as { fontSize: FontSize; highContrast: boolean; theme?: Theme };
      setFontSize(parsed.fontSize);
      setHighContrast(parsed.highContrast);
      if (parsed.theme) setTheme(parsed.theme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.fontSize = fontSize;
    document.documentElement.dataset.highContrast = String(highContrast);
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize, highContrast, theme }));
  }, [fontSize, highContrast, theme]);

  function toggleTheme() {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }

  return (
    <AccessibilityContext.Provider
      value={{ fontSize, setFontSize, highContrast, setHighContrast, theme, setTheme, toggleTheme }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}
