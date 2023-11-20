import type { Setting } from "~/provider/settings/Setting";

export interface RangeSettingOptions {
  name: string;
  description: string;
  min: number;
  max: number;
  initial(this: void): number;
}

export interface RangeSetting extends Setting<number> {
  type: "RANGE";
  min: number;
  max: number;
}
