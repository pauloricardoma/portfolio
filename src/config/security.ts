/**
 * Headers de segurança do HTML (spec 0003, ADR 0005).
 *
 * O HTML sai do SSR (Netlify Function), então os headers dele são definidos
 * aqui e aplicados no entry.server. O netlify.toml cuida só dos estáticos.
 *
 * A CSP usa nonce por requisição: o React Router põe scripts inline que mudam
 * a cada página (contexto e dados em stream), então hash não serve.
 * Script inline novo precisa receber o nonce (NonceContext), senão é bloqueado.
 */

/** Nonce de 128 bits em base64, novo a cada requisição. Nunca logar. */
export function createNonce() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString("base64");
}

/**
 * Política da página. Nada de terceiros: fontes, 3D e imagens vêm do site.
 * `style-src 'unsafe-inline'`: o styled-components injeta <style> e há
 * atributos `style` do React (risco aceito em docs/seguranca.md §5).
 */
export function buildCsp(nonce: string) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

/**
 * Todos os headers do HTML. A CSP só em produção (o dev do Vite usa scripts
 * inline e WebSocket de HMR). `no-store`: um HTML cacheado reaproveitaria o
 * nonce e anularia a CSP.
 */
export function securityHeaders(nonce: string, production: boolean): Record<string, string> {
  return {
    ...(production && { "Content-Security-Policy": buildCsp(nonce) }),
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Cache-Control": "no-store",
  };
}
