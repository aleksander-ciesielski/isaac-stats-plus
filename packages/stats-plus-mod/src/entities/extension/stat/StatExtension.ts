import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { Hashable } from "~/decorators/Hashable";
import { Hash } from "~/decorators/Hash";

@Hashable()
export class StatExtension {
  @Hash()
  public readonly addonId: string;

  @Hash()
  public readonly statId: string;

  public constructor(ref: StatsPlusAPI.ExtensionRef) {
    this.addonId = ref.addon;
    this.statId = ref.id;
  }

  public getExternalAPI(): StatsPlusAPI.ExtensionRef {
    return {
      addon: this.addonId,
      id: this.statId,
    };
  }
}
