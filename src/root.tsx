/**
 * root.tsx — Layout raiz da aplicação.
 *
 * Este é o componente que envolve TODAS as páginas. Aqui configuramos:
 * - HTML base (<html>, <head>, <body>)
 * - Google Fonts (Inter)
 * - ThemeProvider do styled-components (via nosso AppThemeProvider)
 * - GlobalStyle (reset CSS + estilos globais do tema)
 * - Outlet do React Router (renderiza a rota ativa)
 */
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { AppThemeProvider } from "~/contexts/ThemeContext";
import { GlobalStyle } from "~/styles/global";
import Header from "~/components/Shell/Header/Header";

/**
 * links() — Carrega recursos externos no <head>.
 *
 * FONTES — Self-hosting (sem Google Fonts):
 *
 * Antes: <link rel="stylesheet" href="fonts.googleapis.com/...">
 * Isso era render-blocking — o browser parava ~510ms pra:
 * 1. DNS lookup fonts.googleapis.com
 * 2. Baixar o CSS
 * 3. DNS lookup fonts.gstatic.com
 * 4. Baixar os .woff2
 *
 * Agora: os @font-face estão no GlobalStyle (styled-components)
 * e os .woff2 estão em /public/fonts/ (mesmo domínio).
 * O CSS é injetado inline via SSR → zero requests extras.
 * Os .woff2 carregam do mesmo servidor → zero DNS extra.
 *
 * preload: diz ao browser "vai precisar desse arquivo, começa a baixar JÁ"
 * antes mesmo de parsear o CSS que referencia a fonte.
 * Sem preload, o browser só descobre que precisa da fonte quando encontra
 * o @font-face E um elemento que usa essa font-family.
 */
export const links: Route.LinksFunction = () => [
  {
    rel: "preload",
    href: "/fonts/inter-400.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    href: "/fonts/inter-700.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
];

/**
 * Layout — Componente que renderiza o HTML base.
 * O React Router v7 usa esse padrão: Layout envolve tanto a rota ativa
 * quanto o ErrorBoundary. Por isso o ThemeProvider fica aqui,
 * garantindo que mesmo erros tenham o tema aplicado.
 */
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AppThemeProvider>
          <GlobalStyle />
          {children}
        </AppThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/**
 * App — Componente padrão da rota.
 * <Outlet /> renderiza a rota filha ativa (no nosso caso, Home).
 */
export default function App() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

/**
 * ErrorBoundary — Captura erros de renderização e de rota (404, 500, etc.)
 * Mostra uma mensagem amigável pro usuário.
 */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "Ocorreu um erro inesperado.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Erro";
    details =
      error.status === 404
        ? "A página solicitada não foi encontrada."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main style={{ paddingTop: 64, padding: 16, maxWidth: 960, margin: "0 auto" }}>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre style={{ width: "100%", padding: 16, overflowX: "auto" }}>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
