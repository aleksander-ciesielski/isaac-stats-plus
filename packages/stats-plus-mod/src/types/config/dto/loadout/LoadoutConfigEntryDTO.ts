import type { ProviderExtensionDTO } from "~/types/config/dto/extension/ProviderExtensionDTO";
import type { AnyConditionExtensionDTO } from "~/types/config/dto/extension/AnyConditionExtensionDTO";
import type { StatExtensionDTO } from "~/types/config/dto/extension/StatExtensionDTO";

export interface LoadoutConfigEntryDTO {
  stat: StatExtensionDTO;
  primaryProvider: ProviderExtensionDTO;
  secondaryProvider: ProviderExtensionDTO;
  condition: AnyConditionExtensionDTO;
}
