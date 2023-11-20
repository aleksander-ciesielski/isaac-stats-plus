import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { Time } from "~/entities/Time";
import type { ProviderStateDefinition } from "~/entities/extension/provider/ProviderStateDefinition";
import { MetricChange } from "~/entities/metric/MetricChange";

export class ProviderDisplaySettingsDefinition<TState extends StatsPlusAPI.StateListDefinition, TDisplayValue> {
  public constructor(private readonly settings: StatsPlusAPI.DisplaySettings<TState, TDisplayValue>) {}

  public getDisplayState(state: ProviderStateDefinition<TState>): StatsPlusAPI.State<TDisplayValue> | undefined {
    return this.settings.value.get(state.getExternalAPI());
  }

  public formatValue(value: TDisplayValue): string | undefined {
    return this.settings.value.format(value);
  }

  public formatChange(change: TDisplayValue): string | undefined {
    return this.settings.change?.format(change, this.isChangePositive(change));
  }

  public isChangePositive(value: TDisplayValue): boolean {
    return this.settings.change?.isPositive?.(value) ?? true;
  }

  public computeChange(
    prev: TDisplayValue,
    next: TDisplayValue,
    currentRenderTime: Time,
  ): MetricChange<TDisplayValue> {
    const value = this.settings.change?.compute(prev, next);
    if (value === undefined) {
      return MetricChange.empty(currentRenderTime);
    }

    const isPositive = this.settings.change?.isPositive?.(value) ?? false;
    const formattedValue = this.settings.change?.format(value, isPositive);

    return new MetricChange(value, formattedValue, isPositive, currentRenderTime);
  }
}
