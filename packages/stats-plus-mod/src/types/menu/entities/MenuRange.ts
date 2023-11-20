import type { MenuMutableSetting } from "~/types/menu/MenuMutableSetting";

export interface MenuRange extends MenuMutableSetting<number> {
  min: number;
  max: number;
  format?(value: number): string;
}
