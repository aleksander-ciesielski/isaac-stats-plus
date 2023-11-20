import type { Setting } from "~/provider/settings/Setting";
import type { ResolvedSelectOptions } from "~/provider/settings/select/ResolvedSelectOptions";

export type SelectSettingAllowedValue =
  | string
  | number
  | boolean;

export interface SelectSettingOptions<TOption extends SelectSettingAllowedValue> {
  name: string;
  description: string;
  options: ResolvedSelectOptions<TOption>;
  initial(this: void): number;
}

export interface SelectSetting<TOption extends number | string | boolean> extends Setting<number> {
  type: "SELECT";
  options: ResolvedSelectOptions<TOption>;
}
