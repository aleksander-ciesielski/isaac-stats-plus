import type { SettingEncoder } from "~/types/extension/SettingEncoder";
import type { ProviderSettingDefinition } from "~/types/extension/provider/ProviderSettingDefinition";
import type { ProviderSettingValueType } from "~/types/extension/provider/ProviderSettingValueType";
import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { EncodedSettingValue } from "~/types/extension/EncodedSettingValue";
import { ToggleSettingEncoder } from "~/services/extension/encoders/ToggleSettingEncoder";
import { RangeSettingEncoder } from "~/services/extension/encoders/RangeSettingEncoder";
import { SelectSettingEncoder } from "~/services/extension/encoders/SelectSettingEncoder";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { ProviderToggleSetting } from "~/entities/extension/provider/settings/ProviderToggleSetting";
import { ProviderRangeSetting } from "~/entities/extension/provider/settings/ProviderRangeSetting";
import { ProviderSelectSetting } from "~/entities/extension/provider/settings/ProviderSelectSetting";
import { ErrorWithContext } from "~/errors/ErrorWithContext";

@Singleton()
export class SettingEncoderService {
  public constructor(
    @Inject(ToggleSettingEncoder) private readonly toggleSettingEncoder: ToggleSettingEncoder,
    @Inject(RangeSettingEncoder) private readonly rangeSettingEncoder: RangeSettingEncoder,
    @Inject(SelectSettingEncoder) private readonly selectSettingEncoder: SelectSettingEncoder<StatsPlusAPI.SelectSettingAllowedValue>,
  ) {}

  public encodeSetting<TSetting extends ProviderSettingDefinition<unknown>>(
    setting: TSetting,
    decoded: ProviderSettingValueType<TSetting>,
  ): EncodedSettingValue {
    return this.getEncoderForSetting(setting).encode(decoded, setting);
  }

  public decodeSetting<TSetting extends ProviderSettingDefinition<unknown>>(
    setting: TSetting,
    encoded: EncodedSettingValue,
  ): ProviderSettingValueType<TSetting> {
    return this.getEncoderForSetting(setting).decode(encoded, setting);
  }

  private getEncoderForSetting<TSetting extends ProviderSettingDefinition<unknown>>(
    setting: TSetting,
  ): SettingEncoder<TSetting, EncodedSettingValue> {
    if (setting instanceof ProviderToggleSetting) {
      return this.toggleSettingEncoder as unknown as SettingEncoder<TSetting, EncodedSettingValue>;
    }

    if (setting instanceof ProviderRangeSetting) {
      return this.rangeSettingEncoder as unknown as SettingEncoder<TSetting, EncodedSettingValue>;
    }

    if (setting instanceof ProviderSelectSetting) {
      return this.selectSettingEncoder as unknown as SettingEncoder<TSetting, EncodedSettingValue>;
    }

    throw new ErrorWithContext("Unknown setting type.", { setting });
  }
}
