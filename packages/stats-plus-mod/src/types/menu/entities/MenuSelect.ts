import type { MenuMutableSetting } from "~/types/menu/MenuMutableSetting";
import type { ProviderSelectSettingOption } from "~/entities/extension/provider/settings/ProviderSelectSettingOption";

export interface MenuSelect<TValue> extends MenuMutableSetting<TValue> {
  options: ProviderSelectSettingOption<TValue>[] | readonly ProviderSelectSettingOption<TValue>[];
  fallback(): ProviderSelectSettingOption<TValue>;
}
