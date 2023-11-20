import type { ProviderColor } from "~/entities/config/appearance/ProviderColor";
import type { EncodedSettingValue } from "~/types/extension/EncodedSettingValue";

export interface ProviderSettingsDTO {
  custom: Record<keyof never, EncodedSettingValue>;
  color: ProviderColor;
}
