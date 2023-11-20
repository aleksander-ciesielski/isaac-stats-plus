import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { Hashable } from "~/decorators/Hashable";
import { Hash } from "~/decorators/Hash";

@Hashable()
export class MiddlewareExtension {
  @Hash()
  public readonly addonId: string;

  @Hash()
  public readonly middlewareId: string;

  public constructor(ref: StatsPlusAPI.ExtensionRef) {
    this.addonId = ref.addon;
    this.middlewareId = ref.id;
  }
}
