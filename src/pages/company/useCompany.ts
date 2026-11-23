import { useMemo } from "react";
import { useLocale } from "~/hooks/useLocale";
import { PRODUCTS } from "~/config/products";
import { COMPANY } from "~/config/company";
import type { INavItem } from "~/interfaces/shell/INavItem";
import type { IProductCard } from "~/interfaces/company/IProduct";

export function useCompany() {
  const { locale, t, to } = useLocale();

  const navItems: INavItem[] = useMemo(
    () => [
      { label: t.header.products, href: "#products", kind: "anchor" },
      { label: t.header.services, href: "#services", kind: "anchor" },
      { label: t.header.founder, href: "#founder", kind: "anchor" },
      { label: t.header.contact, href: "#contact", kind: "anchor" },
      { label: t.header.portfolio, href: "/portfolio", kind: "route" },
    ],
    [t]
  );

  const products: IProductCard[] = useMemo(
    () =>
      PRODUCTS.map((product) => ({
        id: product.id,
        name: product.name[locale],
        description: product.description[locale],
        platforms: product.platforms,
        statusLabel: t.company.products.status[product.status],
        url: product.url,
      })),
    [locale, t]
  );

  return {
    t: t.company,
    navItems,
    products,
    company: COMPANY,
    portfolioPath: to("/portfolio"),
  };
}
