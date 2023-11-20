import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { Hashable } from "~/decorators/Hashable";
import { Hash } from "~/decorators/Hash";
import { CORE_ADDON_ID } from "~/core/coreAddonConstants";

@Hashable()
export class ProviderExtension {
  @Hash()
  public readonly addonId: string;

  @Hash()
  public readonly providerId: string;

  public constructor(ref: StatsPlusAPI.ExtensionRef) {
    this.addonId = ref.addon;
    this.providerId = ref.id;
  }

  public isCoreExtension(): boolean {
    return (this.addonId === CORE_ADDON_ID);
  }
}
