import { useLocation } from "react-router";
import {
  dictionaries,
  getLocaleFromPath,
  localizePath,
  stripLocale,
} from "~/i18n/locale";
import type { Locale } from "~/i18n/types";

export function useLocale() {
  const { pathname } = useLocation();
  const locale = getLocaleFromPath(pathname);
  const basePath = stripLocale(pathname);

  return {
    locale,
    t: dictionaries[locale],
    /** Caminho base → caminho no idioma atual */
    to: (path: string) => localizePath(locale, path),
    /** A página atual em outro idioma */
    pathIn: (target: Locale) => localizePath(target, basePath),
  };
}
