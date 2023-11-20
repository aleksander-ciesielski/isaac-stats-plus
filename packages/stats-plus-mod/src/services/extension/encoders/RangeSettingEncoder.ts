import type { SettingEncoder } from "~/types/extension/SettingEncoder";
import type { ProviderRangeSetting } from "~/entities/extension/provider/settings/ProviderRangeSetting";
import { Singleton } from "~/app/ioc/decorators/Singleton";

@Singleton()
export class RangeSettingEncoder implements SettingEncoder<ProviderRangeSetting, number> {
  public encode(decoded: number): number {
    return decoded;
  }

  public decode(encoded: number): number {
    return encoded;
  }
}
