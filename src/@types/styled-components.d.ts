import "styled-components";
import type { ITheme } from "~/styles/themes/types";

declare module "styled-components" {
  export interface DefaultTheme extends ITheme {}
}
