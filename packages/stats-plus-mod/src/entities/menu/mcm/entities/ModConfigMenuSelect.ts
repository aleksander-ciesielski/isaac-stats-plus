import type { MenuEntity } from "~/types/menu/MenuEntity";
import type { ModConfigMenuContext } from "~/types/menu/mcm/ModConfigMenuContext";
import type { MenuSelect } from "~/types/menu/entities/MenuSelect";
import { HashMap } from "~/structures/HashMap";
import { ModConfigMenuResolvedSelectValue } from "~/entities/menu/ModConfigMenuResolvedSelectValue";
import { StructuralComparator } from "~/services/StructuralComparator";
import { ModConfigMenuFormattedOption } from "~/entities/menu/mcm/ModConfigMenuFormattedOption";
import { RGBColor } from "~/entities/renderer/RGBColor";

export class ModConfigMenuSelect<TValue> implements MenuEntity<ModConfigMenuContext> {
  private static readonly FALLBACK_VALUE_COLOR = new RGBColor(0.35294, 0.11765, 0.04706);

  private readonly structuralComparator = new StructuralComparator();

  private readonly valueToIndexMap: HashMap<TValue, number>;
  private readonly indexToValueMap: Map<number, TValue>;

  public constructor(
    private readonly select: MenuSelect<TValue>,
  ) {
    if (this.select.options.length === 0) {
      throw new Error("ModConfigMenuSelect requires at least one option,  yet none were provided.");
    }

    this.valueToIndexMap = new HashMap(this.select.options.map((option, idx) => [option.getValue(), idx]));
    this.indexToValueMap = new Map(this.select.options.map((option, idx) => [idx, option.getValue()]));
  }

  public register(ctx: ModConfigMenuContext): void {
    if (this.select.condition?.() === false) {
      return;
    }

    const value = new ModConfigMenuResolvedSelectValue(this.select, this.valueToIndexMap);

    ctx.modConfigMenu.AddSetting(ctx.category, ctx.subcategory, {
      Type: ModConfigMenuOptionType.NUMBER,
      Info: this.select.description,
      Minimum: 0,
      Maximum: this.valueToIndexMap.size - 1,
      Display: () => {
        const option = new ModConfigMenuFormattedOption(this.select.name, value.option.getName());
        return option.getFormattedText();
      },
      Color: value.isUsingFallbackValue
        ? ModConfigMenuSelect.FALLBACK_VALUE_COLOR.asArray()
        : undefined,
      CurrentSetting: () => {
        const index = this.valueToIndexMap.get(this.select.retrieve() as TValue) ?? 0;
        if (this.select.options[index] === undefined) {
          throw new Error("No matching index found for an option returned by .retrieve().");
        }

        return index;
      },
      OnChange: (value) => {
        const newValue = this.indexToValueMap.get(Number(value)) ?? this.select.options[0]!.getValue();
        if (this.structuralComparator.compare(this.select.retrieve(), newValue)) {
          return;
        }

        this.select.update(newValue);
      },
    });
  }
}
