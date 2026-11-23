import type { Route } from "./+types/company";
import Company from "~/pages/company/Company";
import { dictionaries, getLocaleFromPath } from "~/i18n/locale";
import { buildMeta, organizationJsonLd } from "~/seo/buildMeta";

export function meta({ location }: Route.MetaArgs) {
  const locale = getLocaleFromPath(location.pathname);
  const { meta } = dictionaries[locale];

  return buildMeta({
    locale,
    path: "/",
    title: meta.companyTitle,
    description: meta.companyDescription,
    jsonLd: organizationJsonLd(locale, meta.companyDescription),
  });
}

export default function CompanyRoute() {
  return <Company />;
}
