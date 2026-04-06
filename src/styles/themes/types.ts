/**
 * Nomenclatura (Material Design pattern):
 * - "primary" = cor de ação principal (botões, links, destaques)
 * - "onPrimary" = cor do texto/ícone SOBRE o primary (contraste)
 * - "surface" = cor de fundo das superfícies (cards, body)
 * - "onSurface" = cor do texto sobre surfaces
 * - "Container" = versão suave da cor (fundo com opacidade baixa)
 */

export interface IPrimaryColors {
  primary: string;
  primaryHover: string;
  primaryPressed: string;
  primaryOutline: string;
  primaryContainer: string;
  onPrimary: string;
}

export interface ITertiaryColors {
  tertiary: string;
  tertiaryHover: string;
  tertiaryPressed: string;
  tertiaryOutline: string;
  tertiaryContainer: string;
  onTertiary: string;
}

export interface ISecondaryColors {
  secondary: string;
  secondaryHover: string;
  onSecondary: string;
  onSecondaryVariant: string;
}

export interface ISurfaceColors {
  surface: string;
  surfaceContainer: string;
  surfaceOutline: string;
  onSurface: string;
  onSurfaceVariant: string;
  onSurfacePlaceholder: string;
}

export interface ISemanticColor {
  main: string;
  onMain: string;
  container: string;
}

export interface ITheme {
  colors: {
    primary: IPrimaryColors;
    tertiary: ITertiaryColors;
    secondary: ISecondaryColors;
    surface: ISurfaceColors;
    danger: ISemanticColor;
    warning: ISemanticColor;
    success: ISemanticColor;
  };
  font: {
    family: string;
  };
}
