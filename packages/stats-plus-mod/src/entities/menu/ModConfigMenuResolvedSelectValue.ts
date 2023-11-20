import type { HashMap } from "~/structures/HashMap";
import type { MenuSelect } from "~/types/menu/entities/MenuSelect";
import type { ProviderSelectSettingOption } from "~/entities/extension/provider/settings/ProviderSelectSettingOption";

export class ModConfigMenuResolvedSelectValue<TValue> {
  public readonly option: ProviderSelectSettingOption<TValue>;

  public readonly isUsingFallbackValue: boolean;

  public constructor(
    private readonly select: MenuSelect<TValue>,
    private readonly valueToIndexMap: HashMap<TValue, number>,
  ) {
    const index = this.getIndex();

    this.isUsingFallbackValue = (
      index === undefined
      || select.options[index] === undefined
    );

    this.option = this.isUsingFallbackValue
      ? select.fallback()
      : select.options[index!]!;
  }

  private getIndex(): number | undefined {
    const value = this.select.retrieve();
    if (value === undefined) {
      return undefined;
    }

    return this.valueToIndexMap.get(value);
  }
}
