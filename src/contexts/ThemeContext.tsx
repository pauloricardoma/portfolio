import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ThemeProvider } from "styled-components";
import theme from "~/styles/themes/theme";
import { colors, type ThemeMode } from "~/styles/tokens";

interface ThemeContextData {
  /**
   * Tema em uso. No SSR e na hidratação vale "light"; o valor real chega
   * depois de montar. Use só para o que não dá para fazer em CSS
   * (cores da cena 3D, por exemplo). Texto e estilo por tema ficam no CSS.
   */
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextData | null>(null);

function readThemeMode(): ThemeMode {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyThemeMode(mode: ThemeMode) {
  document.documentElement.setAttribute("data-theme", mode);
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute("content", colors[mode].bg));
  try {
    localStorage.setItem("theme", mode);
  } catch {
    // localStorage indisponível (modo privado): o tema vale só nesta visita
  }
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  useEffect(() => {
    setThemeMode(readThemeMode());

    // Sem escolha manual, acompanha a troca de tema do sistema
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!document.documentElement.hasAttribute("data-theme")) {
        setThemeMode(media.matches ? "dark" : "light");
      }
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    const next: ThemeMode = readThemeMode() === "dark" ? "light" : "dark";
    applyThemeMode(next);
    setThemeMode(next);
  }, []);

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme deve ser usado dentro de AppThemeProvider");
  }
  return context;
}
