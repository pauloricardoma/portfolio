import type { Route } from "./+types/portfolio";
import Portfolio from "~/pages/portfolio/Portfolio";
import { dictionaries, getLocaleFromPath } from "~/i18n/locale";
import { buildMeta, personJsonLd } from "~/seo/buildMeta";

export function meta({ location }: Route.MetaArgs) {
  const locale = getLocaleFromPath(location.pathname);
  const { meta } = dictionaries[locale];

  return buildMeta({
    locale,
    path: "/portfolio",
    title: meta.portfolioTitle,
    description: meta.portfolioDescription,
    ogType: "profile",
    jsonLd: personJsonLd(locale),
  });
}

export default function PortfolioRoute() {
  return <Portfolio />;
}
