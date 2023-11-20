import type { SettingListDefinition } from "~/provider/settings/SettingListDefinition";
import type { ResolvedSetting } from "~/provider/settings/ResolvedSetting";
import type { ProviderColor } from "~/provider/ProviderColor";

export type ResolvedSettings<TSettings extends SettingListDefinition> = {
  color: ProviderColor;
  custom: {
    [K in keyof TSettings]: ResolvedSetting<TSettings[K]>;
  };
};
