/**
 * Tema da PRMA Code. Os valores são referências a variáveis CSS
 * (`var(--bg)` etc.), definidas por `[data-theme]` em global.ts.
 * Por isso existe um objeto de tema só: trocar o tema muda o atributo
 * no <html>, não o objeto, e o SSR nunca diverge do cliente.
 */
export interface ITheme {
  colors: {
    bg: string;
    ink: string;
    muted: string;
    line: string;
    card: string;
    accent: string;
    /** Texto sobre o laranja */
    onAccent: string;
    /** Laranja suave sobre o fundo (realces, estados ativos) */
    accentSoft: string;
    /** Faixa de contato, sempre escura */
    contact: {
      bg: string;
      ink: string;
      body: string;
      label: string;
      border: string;
    };
  };
  font: {
    sans: string;
    mono: string;
  };
}
