import type { ComputableListDefinition } from "~/provider/computables/ComputableListDefinition";
import type { SettingListDefinition } from "~/provider/settings/SettingListDefinition";
import type { StateListDefinition } from "~/provider/state/StateListDefinition";
import type { ResolvedState } from "~/provider/state/ResolvedState";
import type { ResolvedComputableList } from "~/provider/computables/ResolvedComputableList";
import type { ResolvedSettings } from "~/provider/settings/ResolvedSettings";
import type { CompanionConditionListDefinition } from "~/condition/companion/CompanionConditionListDefinition";
import type { ResolvedCompanionConditions } from "~/condition/companion/ResolvedCompanionConditions";
import type { ExtensionRef } from "~/ExtensionRef";

export interface ProviderContext<
  TComputables extends ComputableListDefinition = {},
  TCompanionConditions extends CompanionConditionListDefinition = {},
  TSettings extends SettingListDefinition = {},
  TState extends StateListDefinition = {},
> {
  player: EntityPlayer;
  playerIndex: number;
  stat: ExtensionRef;
  state: ResolvedState<TState>;
  computables: ResolvedComputableList<TComputables>;
  conditions: ResolvedCompanionConditions<TCompanionConditions>;
  settings: ResolvedSettings<TSettings>;
}
