/**
 * styled-components.d.ts — Extensão de tipo do DefaultTheme.
 *
 * O styled-components tem um tipo genérico "DefaultTheme" que por padrão é vazio ({}).
 * Aqui estamos dizendo: "DefaultTheme na verdade é ITheme".
 *
 * Isso faz com que em QUALQUER styled-component, ao acessar
 * ${({ theme }) => theme.colors.primary.primary}, o TS autocomplete
 * todas as propriedades disponíveis.
 *
 * Esse padrão é o "module augmentation" do TypeScript — estamos
 * estendendo um módulo existente sem modificar o código fonte dele.
 */
import "styled-components";
import type { ITheme } from "~/styles/themes/types";

declare module "styled-components" {
  export interface DefaultTheme extends ITheme {}
}
