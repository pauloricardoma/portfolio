/**
 * global.ts — Estilos globais da aplicação.
 *
 * createGlobalStyle é uma função do styled-components que injeta CSS
 * diretamente no <head> do documento. Diferente de um componente styled,
 * ele não cria um elemento — apenas aplica estilos globais.
 *
 * Aqui fazemos:
 * 1. Reset básico (box-sizing, margin)
 * 2. Aplicar font e cores do tema (acessando ${({ theme }) => ...})
 * 3. Customizar scrollbar (padrão visual do Coordly)
 * 4. Smooth scroll pra navegação entre seções
 */
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  /**
   * @font-face local — Self-hosting da Inter.
   *
   * POR QUE SELF-HOST em vez de Google Fonts:
   *
   * Google Fonts usa <link rel="stylesheet"> que é render-blocking:
   * 1. Browser para renderização
   * 2. DNS lookup pra fonts.googleapis.com (~50ms)
   * 3. Baixa o CSS (~100ms)
   * 4. CSS aponta pra fonts.gstatic.com → outro DNS + download (~200ms)
   * = ~350-500ms de bloqueio antes de pintar qualquer texto.
   *
   * Self-hosting elimina tudo isso:
   * - Arquivos .woff2 servidos do MESMO domínio (zero DNS extra)
   * - CSS inline via styled-components (já está no HTML do SSR)
   * - font-display: optional = se carregar em ~100ms usa, senão fallback
   *
   * woff2 é o formato mais comprimido (~24KB por peso).
   * Todos os browsers modernos suportam (Can I Use: 97%+).
   */
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-display: optional;
    src: url('/fonts/inter-400.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
      U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122,
      U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-display: optional;
    src: url('/fonts/inter-500.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
      U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122,
      U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-display: optional;
    src: url('/fonts/inter-600.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
      U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122,
      U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-display: optional;
    src: url('/fonts/inter-700.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
      U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122,
      U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  /* Reset: box-sizing border-box faz com que padding e border
     sejam incluídos no width/height do elemento (evita quebras de layout) */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    /* smooth scroll: quando clicar em anchor links (#seção),
       o scroll vai suave em vez de pular */
    scroll-behavior: smooth;
    font-size: 16px;
  }

  /**
   * Font stack com fallbacks de métricas similares à Inter:
   * - "Inter": a fonte principal (Google Fonts)
   * - system-ui, -apple-system: fontes do sistema (SF Pro no Mac, Segoe no Windows)
   *   Elas têm métricas MUITO similares à Inter (mesma altura-x, largura média).
   *   Isso minimiza o "salto" de texto (CLS) quando a Inter carrega e substitui.
   *
   * Sem fallback com métricas parecidas, o browser usa serif (Times New Roman),
   * que tem larguras totalmente diferentes → texto inteiro muda de tamanho → CLS alto.
   */
  body {
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
    background-color: ${({ theme }) => theme.colors.surface.surface};
    color: ${({ theme }) => theme.colors.surface.onSurface};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* Transição suave ao trocar de tema (light ↔ dark) */
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  /**
   * CLS fix: main com contain: layout.
   *
   * CSS Containment diz ao browser que o conteúdo dentro de main
   * NÃO afeta o layout de elementos fora dele.
   * Isso limita o "blast radius" de layout shifts — quando um
   * componente lazy carrega, o reflow fica contido dentro do main.
   */
  main {
    contain: layout;
  }

  /* Scrollbar customizada — visual mais discreto e elegante */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.surface.onSurfaceVariant} transparent;

    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${({ theme }) => theme.colors.surface.onSurfaceVariant};
      border-radius: 4px;
    }
  }
`;
