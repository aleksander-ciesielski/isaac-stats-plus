import type { Player } from "~/entities/player/Player";
import type { ProviderInstanceHandle } from "~/entities/extension/provider/handle/ProviderInstanceHandle";
import type { ConditionDefinition } from "~/types/extension/condition/ConditionDefinition";
import type { StatExtension } from "~/entities/extension/stat/StatExtension";

export interface ConditionInstanceHandleContextOptions {
  player: Player;
  stat: StatExtension;
  providers: ProviderInstanceHandle[];
  condition: ConditionDefinition;
}

export class ConditionInstanceHandleContext {
  public readonly player: Player;
  public readonly stat: StatExtension;
  public readonly providers: ProviderInstanceHandle[];
  public readonly condition: ConditionDefinition;

  public constructor(options: ConditionInstanceHandleContextOptions) {
    this.player = options.player;
    this.stat = options.stat;
    this.providers = options.providers;
    this.condition = options.condition;
  }
}
