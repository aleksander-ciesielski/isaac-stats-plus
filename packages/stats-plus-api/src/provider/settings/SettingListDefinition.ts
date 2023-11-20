import type { Setting } from "~/provider/settings/Setting";

export type SettingListDefinition = Record<keyof never, Setting<any>>;
