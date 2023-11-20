import type { CleanupFunction } from "~/provider/CleanupFunction";
import type { ConditionContext } from "~/condition/ConditionContext";

export interface StandaloneConditionDefinition {
  id: string;
  name: string;
  description: string;
  mount(this: void, context: ConditionContext): CleanupFunction | undefined;
}
