import type { SettingType } from "~/provider/settings/SettingType";

export interface Setting<TValue> {
  name: string;
  description: string;
  type: SettingType;
  initial(this: void): TValue;
}
