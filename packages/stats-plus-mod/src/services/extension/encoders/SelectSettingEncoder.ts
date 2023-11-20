import type { SettingEncoder } from "~/types/extension/SettingEncoder";
import type { ProviderSelectSetting } from "~/entities/extension/provider/settings/ProviderSelectSetting";
import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { ErrorWithContext } from "~/errors/ErrorWithContext";

@Singleton()
export class SelectSettingEncoder<TValue extends StatsPlusAPI.SelectSettingAllowedValue>
implements SettingEncoder<ProviderSelectSetting<TValue>, number> {
  public encode(decoded: TValue, setting: ProviderSelectSetting<TValue>): number {
    const index = setting.getOptions().findIndex((option) => (option.getValue() === decoded));
    if (index === -1) {
      // eslint-disable-next-line max-len
      throw new ErrorWithContext("Could not find a select option matching the given value.", {
        settingName: setting.getName(),
        settingKey: setting.getKey(),
      });
    }

    return index;
  }

  public decode(encoded: number, setting: ProviderSelectSetting<TValue>): TValue {
    return setting.getOptions()[encoded]!.getValue();
  }
}
