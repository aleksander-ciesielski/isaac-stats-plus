import type { ProviderDefinition } from "~/entities/extension/provider/ProviderDefinition";
import type { MetricValue } from "~/entities/metric/MetricValue";
import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { ProviderInstanceHandleContext } from "~/entities/player/provider/ProviderInstanceHandleContext";
import type { ProviderColor } from "~/entities/config/appearance/ProviderColor";

export class ProviderInstanceHandle<
  TDisplayValue = unknown,
  TComputables extends StatsPlusAPI.ComputableListDefinition = {},
  TCompanionConditions extends StatsPlusAPI.CompanionConditionListDefinition = {},
  TSettings extends StatsPlusAPI.SettingListDefinition = {},
  TState extends StatsPlusAPI.StateListDefinition = {},
> {
  public constructor(
    private readonly provider: ProviderDefinition<
      TDisplayValue,
      TComputables,
      TCompanionConditions,
      TSettings,
      TState
    >,
    private readonly context: ProviderInstanceHandleContext<
      TDisplayValue,
      TComputables,
      TCompanionConditions,
      TSettings,
      TState
    >,
    private readonly cleanup: StatsPlusAPI.CleanupFunction | undefined,
  ) {}

  public unregister(): void {
    this.cleanup?.();
  }

  public getProvider(): ProviderDefinition<TDisplayValue, TComputables, TCompanionConditions, TSettings, TState> {
    return this.provider;
  }

  public getValue(): MetricValue<TDisplayValue> | undefined {
    return this.context.state.getDisplayStateHandle()?.getMetricValue();
  }

  public getProviderColor(): ProviderColor {
    return this.context.settings.getProviderColor();
  }

  public isCompanionConditionActive(companionConditionIdentifier: string): boolean {
    return this.context.conditions.isActive(companionConditionIdentifier);
  }

  public getExternalAPI(): StatsPlusAPI.ProviderContext<TComputables, TCompanionConditions, TSettings, TState> {
    return {
      player: this.context.player.entityPlayer,
      playerIndex: this.context.player.index,
      stat: this.context.stat.getExternalAPI(),
      computables: this.context.computables.getExternalAPI(),
      conditions: this.context.conditions.getExternalAPI(),
      settings: this.context.settings.getExternalAPI(),
      state: this.context.state.getExternalAPI(),
    };
  }
}
