import type { Localized } from "~/i18n/types";

export type ProductStatus = "coming-soon" | "live";

export interface IProduct {
  id: string;
  name: Localized<string>;
  description: Localized<string>;
  platforms: string[];
  status: ProductStatus;
  url?: string;
}

/** Produto já resolvido para o idioma atual, pronto para a View */
export interface IProductCard {
  id: string;
  name: string;
  description: string;
  platforms: string[];
  statusLabel: string;
  url?: string;
}
