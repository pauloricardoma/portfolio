import { describe, expect, it } from "vitest";
import { buildCsp, createNonce, securityHeaders } from "./security";

describe("createNonce", () => {
  it("gera base64 de 16 bytes", () => {
    const nonce = createNonce();
    expect(nonce).toMatch(/^[A-Za-z0-9+/]{22}==$/);
    expect(Buffer.from(nonce, "base64")).toHaveLength(16);
  });

  it("muda a cada chamada", () => {
    const nonces = new Set(Array.from({ length: 50 }, createNonce));
    expect(nonces.size).toBe(50);
  });
});

describe("buildCsp", () => {
  const csp = buildCsp("abc123");

  it("libera scripts só do próprio site e com o nonce", () => {
    expect(csp).toContain("script-src 'self' 'nonce-abc123'");
    expect(csp).not.toMatch(/script-src[^;]*unsafe-inline/);
    expect(csp).not.toContain("unsafe-eval");
  });

  it("tem a política completa da spec 0003", () => {
    expect(csp.split("; ")).toEqual([
      "default-src 'self'",
      "script-src 'self' 'nonce-abc123'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ]);
  });

  it("não cita nenhum domínio de terceiro", () => {
    expect(csp).not.toMatch(/https?:|\*\./);
  });
});

describe("securityHeaders", () => {
  it("em produção inclui a CSP com o nonce", () => {
    const headers = securityHeaders("n0nce", true);
    expect(headers["Content-Security-Policy"]).toContain("'nonce-n0nce'");
  });

  it("fora de produção não manda CSP (o dev do Vite usa scripts inline e HMR)", () => {
    expect(securityHeaders("n0nce", false)).not.toHaveProperty("Content-Security-Policy");
  });

  it("sempre manda os outros headers e o HTML sem cache", () => {
    for (const prod of [true, false]) {
      const headers = securityHeaders("n", prod);
      expect(headers).toMatchObject({
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
        "Cross-Origin-Opener-Policy": "same-origin",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        "Cache-Control": "no-store",
      });
    }
  });
});
