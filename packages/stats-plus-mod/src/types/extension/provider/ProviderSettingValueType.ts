import type { ProviderSettingDefinition } from "~/types/extension/provider/ProviderSettingDefinition";

export type ProviderSettingValueType<TSetting extends ProviderSettingDefinition<unknown>> = (
  TSetting extends ProviderSettingDefinition<infer TValue>
    ? TValue
    : never
);
