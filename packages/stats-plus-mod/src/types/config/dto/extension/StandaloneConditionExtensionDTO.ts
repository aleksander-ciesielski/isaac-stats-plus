import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { ConditionType } from "~/entities/extension/condition/ConditionType";

export interface StandaloneConditionExtensionDTO {
  type: ConditionType.Standalone;
  ref: StatsPlusAPI.ExtensionRef;
}
