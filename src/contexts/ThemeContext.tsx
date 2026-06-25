import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeName = 'futuristic' | 'warm';

type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  bright: boolean;
  setBright: (b: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue>({ theme: 'futuristic', setTheme: () => {}, bright: false, setBright: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(() => (localStorage.getItem('rptheme') as ThemeName) || 'futuristic');
  const [bright, setBright] = useState<boolean>(() => localStorage.getItem('rpbright') === 'true');

  useEffect(() => {
    localStorage.setItem('rptheme', theme);
    localStorage.setItem('rpbright', String(bright));
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-bright', String(bright));
  }, [theme, bright]);

  return <ThemeContext.Provider value={{ theme, setTheme, bright, setBright }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeContext;
