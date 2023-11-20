import type { MenuSetting } from "~/types/menu/MenuSetting";

export interface MenuMutableSetting<TValue> extends MenuSetting<TValue> {
  update(value: TValue): void;
}
