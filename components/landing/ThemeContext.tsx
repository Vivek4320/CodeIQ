"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { themes, type ThemeColors, type ThemeKey } from "./theme";

interface ThemeContextValue {
  theme: ThemeColors;
  themeKey: ThemeKey;
  setTheme: (key: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: themes.midnight,
  themeKey: "midnight",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeKey, setThemeKey] = useState<ThemeKey>("midnight");

  const setTheme = useCallback((key: ThemeKey) => {
    setThemeKey(key);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: themes[themeKey], themeKey, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
