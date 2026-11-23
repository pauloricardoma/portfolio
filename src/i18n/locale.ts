import type { IDictionary, Locale } from "./types";
import en from "./en";
import pt from "./pt";

/** Inglês fica na raiz (/), português sob /pt. Sem redirecionamento automático por idioma. */
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALES: Locale[] = ["en", "pt"];

export const dictionaries: Record<Locale, IDictionary> = { en, pt };

export const htmlLang: Record<Locale, string> = { en: "en", pt: "pt-BR" };
export const ogLocale: Record<Locale, string> = { en: "en_US", pt: "pt_BR" };

const PT_PREFIX = "/pt";

export function getLocaleFromPath(pathname: string): Locale {
  return pathname === PT_PREFIX || pathname.startsWith(`${PT_PREFIX}/`) ? "pt" : "en";
}

/** "/pt/portfolio" → "/portfolio", "/pt" → "/" */
export function stripLocale(pathname: string): string {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (getLocaleFromPath(clean) !== "pt") return clean || "/";
  return clean.slice(PT_PREFIX.length) || "/";
}

/** Caminho base ("/portfolio") → caminho no idioma ("/pt/portfolio"). */
export function localizePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  return path === "/" ? PT_PREFIX : `${PT_PREFIX}${path}`;
}
