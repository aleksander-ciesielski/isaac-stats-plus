import type { MenuEntity } from "~/types/menu/MenuEntity";
import type { ModConfigMenuContext } from "~/types/menu/mcm/ModConfigMenuContext";
import type { MenuReadonlyValue } from "~/types/menu/entities/MenuReadonlyValue";
import { ModConfigMenuFormattedOption } from "~/entities/menu/mcm/ModConfigMenuFormattedOption";

export class ModConfigMenuReadonlyValue implements MenuEntity<ModConfigMenuContext> {
  private static readonly FALLBACK_VALUE = "?";

  public constructor(private readonly readonlyValue: MenuReadonlyValue) {}

  public register(ctx: ModConfigMenuContext): void {
    const option = new ModConfigMenuFormattedOption(
      this.readonlyValue.name,
      this.readonlyValue.value ?? ModConfigMenuReadonlyValue.FALLBACK_VALUE,
    );

    ctx.modConfigMenu.AddText(
      ctx.category,
      ctx.subcategory,
      () => option.getFormattedText(),
    );
  }
}
