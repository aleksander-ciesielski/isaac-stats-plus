import type { Addon } from "~/Addon";
import type { ToggleSetting, ToggleSettingOptions } from "~/provider/settings/toggle/ToggleSetting";
import type {
  SelectSetting,
  SelectSettingAllowedValue,
  SelectSettingOptions,
} from "~/provider/settings/select/SelectSetting";
import type { RangeSetting, RangeSettingOptions } from "~/provider/settings/range/RangeSetting";
import type { Middleware } from "~/middleware/Middleware";
import type { StateListDefinition } from "~/provider/state/StateListDefinition";
import type { ComputableListDefinition } from "~/provider/computables/ComputableListDefinition";
import type { SettingListDefinition } from "~/provider/settings/SettingListDefinition";
import type { Provider } from "~/provider/Provider";
import type { StandaloneConditionDefinition } from "~/condition/StandaloneConditionDefinition";
import type { CompanionConditionListDefinition } from "~/condition/companion/CompanionConditionListDefinition";
import type { Stat } from "~/stat/Stat";
import type { ExtensionRef } from "~/ExtensionRef";
import type { ComputableRef } from "~/middleware/ComputableRef";

export interface API {
  readonly settings: {
    toggle(options: ToggleSettingOptions): ToggleSetting;
    select<TOption extends SelectSettingAllowedValue>(options: SelectSettingOptions<TOption>): SelectSetting<TOption>;
    range(options: RangeSettingOptions): RangeSetting;
  };
  register(addon: Addon): void;
  stat: Stat;
  middleware<TArgs extends unknown[], TReturnType>(
    middleware: Middleware<TArgs, TReturnType>,
  ): Middleware<TArgs, TReturnType>;
  provider<
    TDisplayValue,
    TComputables extends ComputableListDefinition = {},
    TCompanionConditions extends CompanionConditionListDefinition = {},
    TSettings extends SettingListDefinition = {},
    TState extends StateListDefinition = {},
  >(
    provider: Provider<TDisplayValue, TComputables, TCompanionConditions, TSettings, TState>,
  ): Provider<TDisplayValue, TComputables, TCompanionConditions, TSettings, TState>;
  condition(condition: StandaloneConditionDefinition): StandaloneConditionDefinition;
  compareExtensionRefs(first: ExtensionRef, second: ExtensionRef): boolean;
  compareComputableRefs(first: ComputableRef, second: ComputableRef): boolean;
}
