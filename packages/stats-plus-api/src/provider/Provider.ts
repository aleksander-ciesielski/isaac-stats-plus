import type { CleanupFunction } from "~/provider/CleanupFunction";
import type { ComputableListDefinition } from "~/provider/computables/ComputableListDefinition";
import type { SettingListDefinition } from "~/provider/settings/SettingListDefinition";
import type { ProviderContext } from "~/provider/ProviderContext";
import type { StateListDefinition } from "~/provider/state/StateListDefinition";
import type { DisplaySettings } from "~/provider/DisplaySettings";
import type { CompanionConditionListDefinition } from "~/condition/companion/CompanionConditionListDefinition";
import type { ProviderColor } from "~/provider/ProviderColor";
import type { ExtensionRef } from "~/ExtensionRef";

export interface Provider<
  TDisplayValue = unknown,
  TComputables extends ComputableListDefinition = ComputableListDefinition,
  TConditions extends CompanionConditionListDefinition = CompanionConditionListDefinition,
  TSettings extends SettingListDefinition = SettingListDefinition,
  TState extends StateListDefinition = StateListDefinition,
> {
  id: string;
  name: string;
  description: string;
  targets?: ExtensionRef[] | undefined;
  display: DisplaySettings<TState, TDisplayValue>;
  color?: ProviderColor;
  computables?: TComputables;
  conditions?: TConditions;
  settings?: TSettings;
  state?: TState;
  mount(
    this: void,
    context: ProviderContext<TComputables, TConditions, TSettings, TState>,
  ): CleanupFunction | undefined;
}
