import type { ProviderSettingDefinition } from "~/types/extension/provider/ProviderSettingDefinition";
import type { ProviderSettingValueType } from "~/types/extension/provider/ProviderSettingValueType";

export interface SettingEncoder<
  TSetting extends ProviderSettingDefinition<unknown>,
  TEncodedValue extends number | string,
> {
  encode(decoded: ProviderSettingValueType<TSetting>, setting: TSetting): TEncodedValue;
  decode(encoded: TEncodedValue, setting: TSetting): ProviderSettingValueType<TSetting>;
}
