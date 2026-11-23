import { createGlobalStyle } from "styled-components";
import { themeVars } from "~/styles/themes/theme";

const fontFace = (family: string, file: string, weight: number) => `
  @font-face {
    font-family: '${family}';
    font-style: normal;
    font-weight: ${weight};
    font-display: swap;
    src: url('/fonts/${file}.woff2') format('woff2');
  }
`;

export const GlobalStyle = createGlobalStyle`
  ${fontFace("Geist", "geist-400", 400)}
  ${fontFace("Geist", "geist-500", 500)}
  ${fontFace("Geist", "geist-600", 600)}
  ${fontFace("Geist Mono", "geist-mono-500", 500)}
  ${fontFace("Geist Mono", "geist-mono-600", 600)}

  /*
   * Tema: o script do <head> (styles/themeScript.ts) define data-theme antes
   * da pintura. Sem JS, vale a preferência do sistema.
   */
  :root {
    ${themeVars("light")}
  }

  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      ${themeVars("dark")}
    }
  }

  :root[data-theme="dark"] {
    ${themeVars("dark")}
  }

  /* Partes da UI que mudam com o tema sem passar pelo estado do React */
  :root[data-theme="dark"] .only-light,
  :root:not([data-theme="dark"]) .only-dark {
    display: none;
  }

  @media (prefers-color-scheme: dark) {
    :root:not([data-theme]) .only-light {
      display: none;
    }
    :root:not([data-theme]) .only-dark {
      display: inline;
    }
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
  }

  body {
    font-family: ${({ theme }) => theme.font.sans};
    background-color: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.ink};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  main {
    contain: layout;
  }

  ::selection {
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.onAccent};
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.muted} transparent;
  }

  @keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Elementos animados por useReveal: nascem escondidos para evitar flash/CLS */
  .reveal {
    visibility: hidden;
  }
`;
