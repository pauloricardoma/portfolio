import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import { useContext } from "react";
import type { Route } from "./+types/root";
import { NonceContext } from "~/contexts/NonceContext";
import { AppThemeProvider } from "~/contexts/ThemeContext";
import { GlobalStyle } from "~/styles/global";
import { getLocaleFromPath, htmlLang } from "~/i18n/locale";
import { useLocale } from "~/hooks/useLocale";
import { THEME_INIT_SCRIPT } from "~/styles/themeScript";
import { colors } from "~/styles/tokens";

export const links: Route.LinksFunction = () => [
  {
    rel: "preload",
    href: "/fonts/geist-400.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    href: "/fonts/geist-600.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const locale = getLocaleFromPath(pathname);
  /** Nonce da CSP (spec 0003): todo script inline precisa dele. "" no cliente. */
  const nonce = useContext(NonceContext);

  return (
    // data-theme é definido pelo script abaixo antes da hidratação
    <html lang={htmlLang[locale]} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content={colors.light.bg}
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content={colors.dark.bg}
        />
        {/* Conteúdo fixo do repositório (seguranca.md §4). O navegador esconde o
            nonce depois de ler, então o cliente hidrata com "" sem reclamar. */}
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
        <Meta />
        <Links />
        <noscript>
          <style>{`.reveal { visibility: visible !important; }`}</style>
        </noscript>
      </head>
      <body>
        <AppThemeProvider>
          <GlobalStyle />
          {children}
        </AppThemeProvider>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t } = useLocale();
  let message = "Oops!";
  let details = t.errors.unexpected;
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : t.errors.title;
    details =
      error.status === 404 ? t.errors.notFound : error.statusText || details;
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
