import type { StandaloneConditionExtensionDTO } from "~/types/config/dto/extension/StandaloneConditionExtensionDTO";
import type { CompanionConditionExtensionDTO } from "~/types/config/dto/extension/CompanionConditionExtensionDTO";

export type AnyConditionExtensionDTO =
  | StandaloneConditionExtensionDTO
  | CompanionConditionExtensionDTO;
