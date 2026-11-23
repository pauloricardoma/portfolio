import { colors, fonts, accent, onAccent, type ThemeMode } from "~/styles/tokens";
import type { ITheme } from "./types";

const theme: ITheme = {
  colors: {
    bg: "var(--bg)",
    ink: "var(--ink)",
    muted: "var(--muted)",
    line: "var(--line)",
    card: "var(--card)",
    accent: "var(--accent)",
    onAccent: "var(--on-accent)",
    accentSoft: "color-mix(in srgb, var(--accent) 14%, var(--bg))",
    contact: {
      bg: colors.contact.bg,
      ink: colors.contact.ink,
      body: colors.contact.body,
      label: colors.contact.label,
      border: colors.contact.border,
    },
  },
  font: fonts,
};

/** Declarações das variáveis CSS de um modo, para o global.ts */
export function themeVars(mode: ThemeMode) {
  const c = colors[mode];
  return `
    --bg: ${c.bg};
    --ink: ${c.ink};
    --muted: ${c.muted};
    --line: ${c.line};
    --card: ${c.card};
    --accent: ${accent};
    --on-accent: ${onAccent};
    color-scheme: ${mode};
  `;
}

export default theme;
