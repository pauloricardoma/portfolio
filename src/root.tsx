import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import type { Route } from "./+types/root";
import { AppThemeProvider } from "~/contexts/ThemeContext";
import { GlobalStyle } from "~/styles/global";
import { getLocaleFromPath, htmlLang } from "~/i18n/locale";
import { useLocale } from "~/hooks/useLocale";

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

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const locale = getLocaleFromPath(pathname);

  return (
    <html lang={htmlLang[locale]}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
        <ScrollRestoration />
        <Scripts />
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
