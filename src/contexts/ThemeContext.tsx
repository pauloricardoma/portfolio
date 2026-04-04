/**
 * ThemeContext.tsx — Gerenciamento de tema (light/dark) + cor primary dinâmica.
 *
 * CONCEITO: Tema dinâmico em runtime
 *
 * O styled-components ThemeProvider recebe um OBJETO de tema.
 * Quando esse objeto muda, TODOS os styled-components re-renderizam
 * com as novas cores automaticamente — sem precisar de CSS variables.
 *
 * Aqui, quando o usuário escolhe uma nova cor primary no color picker:
 * 1. Salvamos a cor no state (primaryColor)
 * 2. Recalculamos TODAS as variantes da primary (hover, pressed, container, etc.)
 *    usando a função buildPrimaryColors()
 * 3. Mesclamos no tema base (light ou dark) via spread operator
 * 4. O ThemeProvider recebe o tema atualizado → tudo re-renderiza
 *
 * useMemo() garante que o tema só é recalculado quando themeMode ou primaryColor mudam.
 */
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

/** Cores primary padrão de cada tema */
const DEFAULT_PRIMARY = {
  light: "#0F2B5B",
  dark: "#4A7FD4",
};


/**
 * buildPrimaryColors — Gera todas as variantes de primary a partir de UMA cor base.
 *
 * Usa color-mix() do CSS pra criar hover, pressed, outline e container.
 * A cor "onPrimary" (texto sobre primary) é sempre branca — funciona
 * bem com a maioria das cores escuras/médias que o usuário vai escolher.
 *
 * Se quiser ser mais preciso, pode calcular a luminância da cor
 * e usar branco ou preto baseado no contraste (acessibilidade WCAG).
 */
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
  /**
   * Inicializamos com os mesmos valores que o servidor usa ("dark" e ""),
   * pra que o primeiro render do client seja IDÊNTICO ao HTML do SSR.
   * Isso evita hydration mismatch — React exige paridade server/client.
   *
   * O useEffect abaixo roda SÓ no client, DEPOIS da hydration,
   * e aí sim aplica o tema real do localStorage/prefers-color-scheme.
   */
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

  /**
   * useMemo — Reconstrói o tema só quando themeMode ou primaryColor mudam.
   *
   * Sem useMemo, criaria um objeto novo a cada render,
   * causando re-render desnecessário de TODOS os styled-components.
   *
   * Se o usuário escolheu uma cor custom, sobrescrevemos as cores primary.
   * Caso contrário, usa o tema padrão (light.ts ou dark.ts).
   */
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
