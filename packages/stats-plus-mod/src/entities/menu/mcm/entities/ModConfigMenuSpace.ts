import type { MenuEntity } from "~/types/menu/MenuEntity";
import type { ModConfigMenuContext } from "~/types/menu/mcm/ModConfigMenuContext";

export class ModConfigMenuSpace implements MenuEntity<ModConfigMenuContext> {
  public register(ctx: ModConfigMenuContext): void {
    ctx.modConfigMenu.AddSpace(ctx.category, ctx.subcategory);
  }
}
