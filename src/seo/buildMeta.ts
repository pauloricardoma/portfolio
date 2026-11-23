import type { MetaDescriptor } from "react-router";
import { COMPANY } from "~/config/company";
import { htmlLang, localizePath, ogLocale } from "~/i18n/locale";
import type { Locale } from "~/i18n/types";

interface BuildMetaParams {
  locale: Locale;
  /** Caminho base, sem prefixo de idioma ("/" ou "/portfolio") */
  path: string;
  title: string;
  description: string;
  ogType?: "website" | "profile";
  jsonLd?: Record<string, unknown>;
}

const OG_IMAGE = `${COMPANY.url}/og-image.png`;

const absolute = (locale: Locale, path: string) =>
  `${COMPANY.url}${localizePath(locale, path)}`;

export function buildMeta({
  locale,
  path,
  title,
  description,
  ogType = "website",
  jsonLd,
}: BuildMetaParams): MetaDescriptor[] {
  const url = absolute(locale, path);
  const otherLocale: Locale = locale === "en" ? "pt" : "en";

  const tags: MetaDescriptor[] = [
    { title },
    { name: "description", content: description },

    { tagName: "link", rel: "canonical", href: url },
    { tagName: "link", rel: "alternate", hrefLang: htmlLang.en, href: absolute("en", path) },
    { tagName: "link", rel: "alternate", hrefLang: htmlLang.pt, href: absolute("pt", path) },
    { tagName: "link", rel: "alternate", hrefLang: "x-default", href: absolute("en", path) },

    { property: "og:type", content: ogType },
    { property: "og:site_name", content: COMPANY.name },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:locale", content: ogLocale[locale] },
    { property: "og:locale:alternate", content: ogLocale[otherLocale] },
    { property: "og:image", content: OG_IMAGE },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: COMPANY.name },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: OG_IMAGE },
  ];

  if (jsonLd) tags.push({ "script:ld+json": jsonLd });

  return tags;
}

export function organizationJsonLd(locale: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY.name,
    url: COMPANY.url,
    email: COMPANY.email,
    description,
    taxID: COMPANY.cnpj,
    address: { "@type": "PostalAddress", addressCountry: "BR" },
    founder: {
      "@type": "Person",
      name: COMPANY.founder.name,
      url: absolute(locale, "/portfolio"),
    },
  };
}

export function personJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: COMPANY.founder.name,
    url: absolute(locale, "/portfolio"),
    jobTitle: "Software Engineer",
    sameAs: [COMPANY.founder.github, COMPANY.founder.linkedin],
    worksFor: { "@type": "Organization", name: COMPANY.name, url: COMPANY.url },
  };
}
