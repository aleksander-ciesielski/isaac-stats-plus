export interface MenuSetting<TValue> {
  name: string;
  description: string[];
  condition?(): boolean;
  retrieve(): TValue | undefined;
}
