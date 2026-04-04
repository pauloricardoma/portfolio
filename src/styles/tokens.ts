/**
 * tokens.ts — Design tokens (valores constantes do design system).
 *
 * Tokens são os "átomos" do design — valores que NÃO mudam entre temas.
 * Cores mudam (light vs dark), mas spacing, font sizes e breakpoints não.
 *
 * Usamos uma base grid de 4px (padrão da indústria):
 * - xs=4, sm=8, md=16, lg=24... cada step é múltiplo de 4
 * - Isso garante alinhamento visual consistente em toda a UI
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

/**
 * Escala tipográfica — cada tamanho tem um propósito:
 * - xs/sm: labels, captions, texto auxiliar
 * - md: corpo de texto padrão (16px é o tamanho base da web)
 * - lg/xl: subtítulos
 * - xxl: títulos de seção
 * - display: títulos grandes
 * - hero: texto do Hero, máximo impacto visual
 */
export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  display: 48,
  hero: 64,
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

/**
 * Line-height — espaçamento entre linhas:
 * - tight (1.2): títulos grandes, onde queremos linhas mais juntas
 * - normal (1.5): corpo de texto, melhor legibilidade
 * - relaxed (1.75): texto com bastante respiro
 */
export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

/**
 * Breakpoints — pontos onde o layout muda (responsive design):
 * - mobile: celulares pequenos
 * - tablet: tablets e celulares grandes
 * - desktop: notebooks e desktops
 * - wide: monitores largos
 *
 * Uso: @media (min-width: ${breakpoints.tablet}px) { ... }
 */
export const breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
