import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { TimeProvider } from "~/services/renderer/TimeProvider";
import type { ProviderDefinition } from "~/entities/extension/provider/ProviderDefinition";
import type { ConfigService } from "~/services/config/ConfigService";
import type { StateEncoder } from "~/entities/extension/provider/handle/state/StateEncoder";
import { MetricValue } from "~/entities/metric/MetricValue";
import { StateHandle } from "~/entities/extension/provider/handle/state/StateHandle";

export class DisplayStateHandle<TValue> {
  private readonly stateHandle: StateHandle<TValue>;
  private readonly metricValue: MetricValue<TValue>;

  public constructor(
    private readonly timeProvider: TimeProvider,
    private readonly key: string,
    private readonly definition: StatsPlusAPI.State<TValue>,
    private readonly provider: ProviderDefinition<TValue>,
    private readonly stateEncoder: StateEncoder<TValue>,
    private readonly configService: ConfigService,
  ) {
    this.stateHandle = new StateHandle(
      this.provider.getExtension(),
      this.definition,
      this.key,
      this.stateEncoder,
      this.configService,
    );

    this.metricValue = new MetricValue({
      initial: this.stateHandle.getExternalAPI().current(),
      formatValue: (value) => this.provider.getDisplaySettings().formatValue(value),
      formatChange: (value) => this.provider.getDisplaySettings().formatChange(value),
      computeChange: (prev, next) => this.provider.getDisplaySettings().computeChange(
        prev,
        next,
        this.timeProvider.getLastRenderTime(),
      ),
    });
  }

  public getKey(): string {
    return this.key;
  }

  public getExternalAPI(): StatsPlusAPI.StateHandle<TValue> {
    return {
      current: () => this.stateHandle.getExternalAPI().current(),
      reset: (silent) => this.setValue(this.definition.initial(), silent),
      set: (value, silent) => this.setValue(value, silent),
    };
  }

  public getMetricValue(): MetricValue<TValue> {
    return this.metricValue;
  }

  private setValue(value: TValue, silent?: boolean): void {
    this.metricValue.setValue(value, this.timeProvider.getLastRenderTime(), silent);
    this.stateHandle.getExternalAPI().set(value);
  }
}
