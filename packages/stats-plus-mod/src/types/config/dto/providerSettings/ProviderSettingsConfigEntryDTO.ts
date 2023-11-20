import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { ProviderSettingsDTO } from "~/types/config/dto/providerSettings/ProviderSettingsDTO";

export interface ProviderSettingsConfigEntryDTO {
  ref: StatsPlusAPI.ExtensionRef;
  settings: ProviderSettingsDTO;
}
