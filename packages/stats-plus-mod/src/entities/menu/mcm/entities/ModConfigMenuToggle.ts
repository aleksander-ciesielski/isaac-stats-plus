import type { MenuEntity } from "~/types/menu/MenuEntity";
import type { ModConfigMenuContext } from "~/types/menu/mcm/ModConfigMenuContext";
import type { MenuToggle } from "~/types/menu/entities/MenuToggle";
import { ModConfigMenuFormattedOption } from "~/entities/menu/mcm/ModConfigMenuFormattedOption";

export class ModConfigMenuToggle implements MenuEntity<ModConfigMenuContext> {
  private static readonly TEXT_TRUE = "Yes";
  private static readonly TEXT_FALSE = "No";

  public constructor(public readonly toggle: MenuToggle) {}

  public register(ctx: ModConfigMenuContext): void {
    if (this.toggle.condition?.() === false) {
      return;
    }

    ctx.modConfigMenu.AddSetting(ctx.category, ctx.subcategory, {
      Type: ModConfigMenuOptionType.BOOLEAN,
      Info: this.toggle.description,
      Display: () => {
        const option = new ModConfigMenuFormattedOption(
          this.toggle.name,
          (this.toggle.retrieve() === true)
            ? ModConfigMenuToggle.TEXT_TRUE
            : ModConfigMenuToggle.TEXT_FALSE,
        );

        return option.getFormattedText();
      },
      CurrentSetting: () => this.toggle.retrieve() ?? false,
      OnChange: (value) => {
        this.toggle.update(value === true);
      },
    });
  }
}
