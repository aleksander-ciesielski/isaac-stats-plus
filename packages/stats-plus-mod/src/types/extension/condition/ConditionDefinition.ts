import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { ProviderInstanceHandle } from "~/entities/extension/provider/handle/ProviderInstanceHandle";
import type { AnyConditionExtension } from "~/types/extension/condition/AnyConditionExtension";

export interface ConditionDefinition {
  getId(): string;
  getName(): string;
  getDescription(): string;
  getExtension(): AnyConditionExtension;
  mount(
    providers: ProviderInstanceHandle[],
    context: StatsPlusAPI.ConditionContext,
  ): StatsPlusAPI.CleanupFunction | undefined;
}
