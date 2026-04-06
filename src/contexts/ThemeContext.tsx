import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ThemeProvider } from "styled-components";
import light from "~/styles/themes/light";
import dark from "~/styles/themes/dark";
import type { ITheme, IPrimaryColors } from "~/styles/themes/types";

type ThemeMode = "light" | "dark";

interface ThemeContextData {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

const DEFAULT_PRIMARY = {
  light: "#0F2B5B",
  dark: "#4A7FD4",
};

function buildPrimaryColors(color: string, surfaceColor: string): IPrimaryColors {
  return {
    primary: color,
    primaryHover: `color-mix(in srgb, ${color} 85%, ${surfaceColor})`,
    primaryPressed: `color-mix(in srgb, ${color} 70%, ${surfaceColor})`,
    primaryOutline: `color-mix(in srgb, ${color} 50%, transparent)`,
    primaryContainer: `color-mix(in srgb, ${color} 14%, ${surfaceColor})`,
    onPrimary: "#FFFFFF",
  };
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  const [primaryColor, setPrimaryColorState] = useState<string>("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as ThemeMode | null;
    if (stored === "light" || stored === "dark") {
      setThemeMode(stored);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setThemeMode(prefersDark ? "dark" : "light");
    }

    const storedColor = localStorage.getItem("primaryColor");
    if (storedColor) {
      setPrimaryColorState(storedColor);
    }

    setHydrated(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const setPrimaryColor = useCallback((color: string) => {
    setPrimaryColorState(color);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("theme", themeMode);
  }, [themeMode, hydrated]);

  useEffect(() => {
    if (hydrated && primaryColor) {
      localStorage.setItem("primaryColor", primaryColor);
    }
  }, [primaryColor, hydrated]);

  const theme: ITheme = useMemo(() => {
    const baseTheme = themeMode === "light" ? light : dark;

    const activeColor = primaryColor || DEFAULT_PRIMARY[themeMode];

    if (activeColor === DEFAULT_PRIMARY[themeMode] && !primaryColor) {
      return baseTheme;
    }

    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: buildPrimaryColors(activeColor, baseTheme.colors.surface.surface),
      },
    };
  }, [themeMode, primaryColor]);

  return (
    <ThemeContext.Provider
      value={{ themeMode, toggleTheme, primaryColor, setPrimaryColor }}
    >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context.toggleTheme) {
    throw new Error("useAppTheme deve ser usado dentro de AppThemeProvider");
  }
  return context;
}
