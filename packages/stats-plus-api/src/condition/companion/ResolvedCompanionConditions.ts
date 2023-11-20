import type { CompanionConditionListDefinition } from "~/condition/companion/CompanionConditionListDefinition";
import type { CompanionConditionContext } from "~/condition/companion/CompanionConditionContext";

export type ResolvedCompanionConditions<TCompanionConditions extends CompanionConditionListDefinition> = {
  [K in keyof TCompanionConditions]: CompanionConditionContext;
};
