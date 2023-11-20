import type { SelectSettingAllowedValue } from "~/provider/settings/select/SelectSetting";

export interface SelectOption<TOption extends SelectSettingAllowedValue> {
  name: string;
  value: TOption;
}
