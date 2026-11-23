import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

/** Inglês na raiz, português sob /pt. Mesmos módulos, ids diferentes. */
export default [
  index("routes/company.tsx", { id: "company-en" }),
  route("portfolio", "routes/portfolio.tsx", { id: "portfolio-en" }),
  ...prefix("pt", [
    index("routes/company.tsx", { id: "company-pt" }),
    route("portfolio", "routes/portfolio.tsx", { id: "portfolio-pt" }),
  ]),
] satisfies RouteConfig;
