import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { ProviderSettingDefinition } from "~/types/extension/provider/ProviderSettingDefinition";
import { ProviderRangeSetting } from "~/entities/extension/provider/settings/ProviderRangeSetting";
import { ProviderToggleSetting } from "~/entities/extension/provider/settings/ProviderToggleSetting";
import { ProviderSelectSetting } from "~/entities/extension/provider/settings/ProviderSelectSetting";
import { ErrorWithContext } from "~/errors/ErrorWithContext";

export class ProviderSettingsDefinition<TSettings extends StatsPlusAPI.SettingListDefinition> {
  public constructor(private readonly settings: TSettings) {}

  public getSettings(): ProviderSettingDefinition<unknown>[] {
    return Object.entries(this.settings).map(
      ([key, definition]) => {
        if (definition.type === "RANGE") {
          return new ProviderRangeSetting(key, definition as StatsPlusAPI.RangeSetting);
        }

        if (definition.type === "TOGGLE") {
          return new ProviderToggleSetting(key, definition as StatsPlusAPI.ToggleSetting);
        }

        if (definition.type === "SELECT") {
          // eslint-disable-next-line max-len
          return new ProviderSelectSetting(key, definition as StatsPlusAPI.SelectSetting<StatsPlusAPI.SelectSettingAllowedValue>);
        }

        throw new ErrorWithContext("Unknown setting type.", {
          settingType: definition.type,
        });
      },
    );
  }
}
