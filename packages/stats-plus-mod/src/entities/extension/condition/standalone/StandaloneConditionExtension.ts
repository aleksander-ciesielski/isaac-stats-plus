import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { Hashable } from "~/decorators/Hashable";
import { Hash } from "~/decorators/Hash";
import { ALWAYS_CONDITION_ID, CORE_ADDON_ID } from "~/core/coreAddonConstants";

@Hashable()
export class StandaloneConditionExtension {
  @Hash()
  public readonly addonId: string;

  @Hash()
  public readonly standaloneConditionId: string;

  public constructor(ref: StatsPlusAPI.ExtensionRef) {
    this.addonId = ref.addon;
    this.standaloneConditionId = ref.id;
  }

  public isAlwaysCondition(): boolean {
    return (
      this.addonId === CORE_ADDON_ID
      && this.standaloneConditionId === ALWAYS_CONDITION_ID
    );
  }
}
