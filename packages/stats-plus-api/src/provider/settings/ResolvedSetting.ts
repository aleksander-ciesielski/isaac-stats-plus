import type { SettingListDefinition } from "~/provider/settings/SettingListDefinition";
import type { Setting } from "~/provider/settings/Setting";
import type { ValueOf } from "type-fest";

export type ResolvedSetting<TSetting extends ValueOf<SettingListDefinition>> = (
  TSetting extends Setting<infer TValue> ? TValue : never
);
