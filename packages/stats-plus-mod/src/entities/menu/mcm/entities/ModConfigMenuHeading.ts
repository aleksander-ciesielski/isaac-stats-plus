import type { MenuEntity } from "~/types/menu/MenuEntity";
import type { ModConfigMenuContext } from "~/types/menu/mcm/ModConfigMenuContext";
import type { MenuHeading } from "~/types/menu/entities/MenuHeading";
import { ModConfigMenuFormattedText } from "~/entities/menu/mcm/ModConfigMenuFormattedText";
import { RGBColor } from "~/entities/renderer/RGBColor";

export class ModConfigMenuHeading implements MenuEntity<ModConfigMenuContext> {
  private static readonly DECORATION = "||||||||||";
  private static readonly COLOR = new RGBColor(0.0549, 0.0549, 0.2157);

  public constructor(private readonly heading: MenuHeading) {}

  public register(ctx: ModConfigMenuContext): void {
    const text = new ModConfigMenuFormattedText(
      this.heading.text,
      ModConfigMenuHeading.DECORATION,
    );

    ctx.modConfigMenu.AddTitle(
      ctx.category,
      ctx.subcategory,
      text.getFormattedText(),
      ModConfigMenuHeading.COLOR.asArray(),
    );
  }
}
