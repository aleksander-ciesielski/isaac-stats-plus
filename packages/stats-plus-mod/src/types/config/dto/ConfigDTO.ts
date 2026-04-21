import type { AppearanceConfigDTO } from "~/types/config/dto/appearance/AppearanceConfigDTO";
import type { LoadoutConfigDTO } from "~/types/config/dto/loadout/LoadoutConfigDTO";
import type { ProviderSettingsConfigDTO } from "~/types/config/dto/providerSettings/ProviderSettingsConfigDTO";
import type { ProviderStateConfigDTO } from "~/types/config/dto/providerState/ProviderStateConfigDTO";
import type { LogLevel } from "~/Logger";

export interface ConfigDTO {
  configVersion: string;
  logLevel: LogLevel;
  appearance: AppearanceConfigDTO;
  loadout: LoadoutConfigDTO;
  providerSettings: ProviderSettingsConfigDTO;
  providerState: ProviderStateConfigDTO;
}
