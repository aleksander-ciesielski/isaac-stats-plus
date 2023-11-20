import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { ConditionType } from "~/entities/extension/condition/ConditionType";

export interface CompanionConditionExtensionDTO {
  type: ConditionType.Companion;
  providerRef: StatsPlusAPI.ExtensionRef;
  id: string;
}
