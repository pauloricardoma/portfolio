import { accent, colors } from "~/styles/tokens";

/**
 * Marca "P com cursor" (handoff: assets/logo-mark-*.svg).
 *
 * - auto: caixa na cor do texto e P na cor do fundo; inverte sozinha com o tema.
 * - dark: caixa escura (para fundos claros fixos).
 * - light: caixa clara (para fundos escuros fixos, como a faixa de contato).
 */
type LogoMarkVariant = "auto" | "dark" | "light";

interface LogoMarkProps {
  size?: number;
  variant?: LogoMarkVariant;
  className?: string;
}

const palette: Record<LogoMarkVariant, { box: string; glyph: string }> = {
  auto: { box: "var(--ink)", glyph: "var(--bg)" },
  dark: { box: colors.dark.bg, glyph: colors.dark.ink },
  light: { box: colors.light.bg, glyph: colors.light.ink },
};

export default function LogoMark({ size = 30, variant = "auto", className }: LogoMarkProps) {
  const { box, glyph } = palette[variant];

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="100" height="100" rx="22" fill={box} />
      <path
        fill={glyph}
        fillRule="evenodd"
        d="M25 37H40A13 13 0 0 1 40 63H32.5V81H25Z M32.5 44H40A6 6 0 0 1 40 56H32.5Z"
      />
      <rect x="61" y="70" width="20" height="8" fill={accent} />
    </svg>
  );
}
