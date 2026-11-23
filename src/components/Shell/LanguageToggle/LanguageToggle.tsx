import { useLocale } from "~/hooks/useLocale";
import { LOCALES, htmlLang } from "~/i18n/locale";
import { ToggleWrapper, ToggleLink } from "./styles";

export default function LanguageToggle() {
  const { locale, t, pathIn } = useLocale();

  return (
    <ToggleWrapper aria-label={t.header.language}>
      {LOCALES.map((target) => (
        <ToggleLink
          key={target}
          to={pathIn(target)}
          hrefLang={htmlLang[target]}
          lang={htmlLang[target]}
          $active={target === locale}
          aria-current={target === locale ? "true" : undefined}
          preventScrollReset
        >
          {target.toUpperCase()}
        </ToggleLink>
      ))}
    </ToggleWrapper>
  );
}
