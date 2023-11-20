import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { ProviderSettingDefinition } from "~/types/extension/provider/ProviderSettingDefinition";

export class ProviderRangeSetting implements ProviderSettingDefinition<number> {
  public constructor(
    private readonly key: string,
    private readonly definition: StatsPlusAPI.RangeSetting,
  ) {}

  public getKey(): string {
    return this.key;
  }

  public getName(): string {
    return this.definition.name;
  }

  public getDescription(): string {
    return this.definition.description;
  }

  public getMinValue(): number {
    return this.definition.min;
  }

  public getMaxValue(): number {
    return this.definition.max;
  }

  public getInitialValue(): number {
    return this.definition.initial();
  }
}
