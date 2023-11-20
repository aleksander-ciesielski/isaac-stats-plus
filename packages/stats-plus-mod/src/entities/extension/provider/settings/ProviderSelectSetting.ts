import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { ProviderSettingDefinition } from "~/types/extension/provider/ProviderSettingDefinition";
import { ProviderSelectSettingOption } from "~/entities/extension/provider/settings/ProviderSelectSettingOption";
import { ErrorWithContext } from "~/errors/ErrorWithContext";

export class ProviderSelectSetting<TValue extends StatsPlusAPI.SelectSettingAllowedValue>
implements ProviderSettingDefinition<TValue> {
  public constructor(
    private readonly key: string,
    private readonly definition: StatsPlusAPI.SelectSetting<TValue>,
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

  public getInitialValue(): TValue {
    const initialIndex = this.definition.initial();
    const option = this.getOptions()[initialIndex];
    if (option === undefined) {
      throw new ErrorWithContext("Could not obtain an initial select value by an index.", {
        initialIndex,
        initialIndexType: typeof initialIndex,
      });
    }

    return option.getValue();
  }

  public getOptions(): ProviderSelectSettingOption<TValue>[] {
    return this.definition.options.map((option) => new ProviderSelectSettingOption(option.name, option.value));
  }
}
