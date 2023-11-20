import type { StandaloneConditionExtension } from "~/entities/extension/condition/standalone/StandaloneConditionExtension";
import type { CompanionConditionExtension } from "~/entities/extension/condition/companion/CompanionConditionExtension";

export type AnyConditionExtension =
  | StandaloneConditionExtension
  | CompanionConditionExtension;
