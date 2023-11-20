import type { MenuEntity } from "~/types/menu/MenuEntity";
import type { ModConfigMenuContext } from "~/types/menu/mcm/ModConfigMenuContext";
import type { MenuSubheading } from "~/types/menu/entities/MenuSubheading";
import { ModConfigMenuFormattedText } from "~/entities/menu/mcm/ModConfigMenuFormattedText";
import { RGBColor } from "~/entities/renderer/RGBColor";

export class ModConfigMenuSubheading implements MenuEntity<ModConfigMenuContext> {
  private static readonly DECORATION = "|||";
  private static readonly COLOR = new RGBColor(0.1922, 0.0627, 0.2353);

  public constructor(private readonly subheading: MenuSubheading) {}

  public register(ctx: ModConfigMenuContext): void {
    const text = new ModConfigMenuFormattedText(
      this.subheading.text,
      ModConfigMenuSubheading.DECORATION,
    );

    ctx.modConfigMenu.AddTitle(
      ctx.category,
      ctx.subcategory,
      text.getFormattedText(),
      ModConfigMenuSubheading.COLOR.asArray(),
    );
  }
}
