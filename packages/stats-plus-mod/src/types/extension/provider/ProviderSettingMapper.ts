import type { MenuEntity } from "~/types/menu/MenuEntity";
import type { ProviderExtension } from "~/entities/extension/provider/ProviderExtension";
import type { ProviderSettingDefinition } from "~/types/extension/provider/ProviderSettingDefinition";

export interface ProviderSettingMapper<TContext> {
  map(provider: ProviderExtension, setting: ProviderSettingDefinition<unknown>): MenuEntity<TContext>;
}
