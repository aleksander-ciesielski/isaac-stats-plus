import type { BracketStyle } from "~/entities/config/appearance/BracketStyle";

export interface AppearanceConfigDTO {
  textOpacity: number;
  bracketStyle: BracketStyle;
  spacing: number;
  showProviderChanges: boolean;
  useShaderColorFix: boolean;
}
