import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { ProviderSettingDefinition } from "~/types/extension/provider/ProviderSettingDefinition";

export class ProviderToggleSetting implements ProviderSettingDefinition<boolean> {
  public constructor(
    private readonly key: string,
    private readonly definition: StatsPlusAPI.ToggleSetting,
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

  public getInitialValue(): boolean {
    return this.definition.initial();
  }
}
