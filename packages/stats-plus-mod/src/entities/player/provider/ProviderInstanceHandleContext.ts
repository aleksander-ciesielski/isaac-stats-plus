import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { Player } from "~/entities/player/Player";
import type { ResolvedComputables } from "~/entities/extension/provider/handle/ResolvedComputables";
import type { ResolvedCompanionConditions } from "~/entities/extension/provider/handle/ResolvedCompanionConditions";
import type { ResolvedSettings } from "~/entities/extension/provider/handle/ResolvedSettings";
import type { ProviderState } from "~/entities/extension/provider/handle/state/ProviderState";
import type { StatExtension } from "~/entities/extension/stat/StatExtension";

export interface ProviderInstanceHandleContextOptions<
  TDisplayValue = unknown,
  TComputables extends StatsPlusAPI.ComputableListDefinition = {},
  TCompanionConditions extends StatsPlusAPI.CompanionConditionListDefinition = {},
  TSettings extends StatsPlusAPI.SettingListDefinition = {},
  TState extends StatsPlusAPI.StateListDefinition = {},
> {
  player: Player;
  stat: StatExtension;
  computables: ResolvedComputables<TComputables>;
  conditions: ResolvedCompanionConditions<TCompanionConditions>;
  settings: ResolvedSettings<TSettings>;
  state: ProviderState<TDisplayValue, TState>;
}

export class ProviderInstanceHandleContext<
  TDisplayValue = unknown,
  TComputables extends StatsPlusAPI.ComputableListDefinition = {},
  TCompanionConditions extends StatsPlusAPI.CompanionConditionListDefinition = {},
  TSettings extends StatsPlusAPI.SettingListDefinition = {},
  TState extends StatsPlusAPI.StateListDefinition = {},
> {
  public readonly player: Player;
  public readonly stat: StatExtension;
  public readonly computables: ResolvedComputables<TComputables>;
  public readonly conditions: ResolvedCompanionConditions<TCompanionConditions>;
  public readonly settings: ResolvedSettings<TSettings>;
  public readonly state: ProviderState<TDisplayValue, TState>;

  public constructor(
    options: ProviderInstanceHandleContextOptions<TDisplayValue, TComputables, TCompanionConditions, TSettings, TState>,
  ) {
    this.player = options.player;
    this.stat = options.stat;
    this.computables = options.computables;
    this.conditions = options.conditions;
    this.settings = options.settings;
    this.state = options.state;
  }

  public getExternalAPI(): StatsPlusAPI.ProviderContext<TComputables, TCompanionConditions, TSettings, TState> {
    return {
      player: this.player.entityPlayer,
      playerIndex: this.player.index,
      stat: this.stat.getExternalAPI(),
      state: this.state.getExternalAPI(),
      computables: this.computables.getExternalAPI(),
      conditions: this.conditions.getExternalAPI(),
      settings: this.settings.getExternalAPI(),
    };
  }
}
