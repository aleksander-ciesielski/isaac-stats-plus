import type { Setting } from "~/provider/settings/Setting";

export interface ToggleSettingOptions {
  name: string;
  description: string;
  initial(this: void): boolean;
}

export interface ToggleSetting extends Setting<boolean> {
  type: "TOGGLE";
}
