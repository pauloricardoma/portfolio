export interface INavItem {
  label: string;
  /** "#id" para âncora na página ou caminho de rota ("/portfolio") */
  href: string;
  kind: "anchor" | "route";
}
