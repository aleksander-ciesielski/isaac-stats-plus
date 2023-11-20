import type { ModConfigMenuContext } from "~/types/menu/mcm/ModConfigMenuContext";
import type { MenuEntity } from "~/types/menu/MenuEntity";
import type { MenuRange } from "~/types/menu/entities/MenuRange";
import { toFixed } from "@isaac-stats-plus/common";
import { rescale } from "~/util/math/rescale";
import { ModConfigMenuFormattedOption } from "~/entities/menu/mcm/ModConfigMenuFormattedOption";

export class ModConfigMenuRange implements MenuEntity<ModConfigMenuContext> {
  private static readonly MIN_VALUE = 0;
  private static readonly MAX_VALUE = 10;

  private static readonly MAX_PRECISION = 2;

  public constructor(private readonly range: MenuRange) {}

  public register(ctx: ModConfigMenuContext): void {
    if (this.range.condition?.() === false) {
      return;
    }

    ctx.modConfigMenu.AddSetting(ctx.category, ctx.subcategory, {
      Type: ModConfigMenuOptionType.SCROLL,
      Info: this.range.description,
      Display: () => {
        const format = this.range.format ?? ((value) => value.toString());
        const scrollValue = Math.round(rescale(
          this.getRangeValue(),
          [this.range.min, this.range.max],
          [ModConfigMenuRange.MIN_VALUE, ModConfigMenuRange.MAX_VALUE],
        ));

        const option = new ModConfigMenuFormattedOption(
          this.range.name,
          `$scroll${scrollValue} (${format(this.getRangeValue())})`,
        );

        return option.getFormattedText();
      },
      CurrentSetting: () => Math.round(rescale(
        toFixed(this.getRangeValue(), ModConfigMenuRange.MAX_PRECISION),
        [this.range.min, this.range.max],
        [ModConfigMenuRange.MIN_VALUE, ModConfigMenuRange.MAX_VALUE],
      )),
      OnChange: (value) => this.range.update(toFixed(rescale(
        Number(value),
        [ModConfigMenuRange.MIN_VALUE, ModConfigMenuRange.MAX_VALUE],
        [this.range.min, this.range.max],
      ), ModConfigMenuRange.MAX_PRECISION)),
    });
  }

  private getRangeValue(): number {
    const value = this.range.retrieve();
    if (value === undefined) {
      return (this.range.min + this.range.max) / 2;
    }

    return value;
  }
}
