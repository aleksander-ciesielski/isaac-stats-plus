import type { CompanionConditionDefinition } from "~/condition/companion/CompanionConditionDefinition";

export type CompanionConditionListDefinition = Record<keyof never, CompanionConditionDefinition>;
