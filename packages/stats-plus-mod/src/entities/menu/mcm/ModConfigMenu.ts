import type { MenuEntity } from "~/types/menu/MenuEntity";
import type { ModConfigMenuContext } from "~/types/menu/mcm/ModConfigMenuContext";
import type { Menu } from "~/types/menu/Menu";
import type { MenuHeading } from "~/types/menu/entities/MenuHeading";
import type { MenuSubheading } from "~/types/menu/entities/MenuSubheading";
import type { MenuRange } from "~/types/menu/entities/MenuRange";
import type { MenuSelect } from "~/types/menu/entities/MenuSelect";
import type { MenuReadonlyValue } from "~/types/menu/entities/MenuReadonlyValue";
import type { MenuToggle } from "~/types/menu/entities/MenuToggle";
import { ModConfigMenuToggle } from "~/entities/menu/mcm/entities/ModConfigMenuToggle";
import { ModConfigMenuReadonlyValue } from "~/entities/menu/mcm/entities/ModConfigMenuReadonlyValue";
import { ModConfigMenuSelect } from "~/entities/menu/mcm/entities/ModConfigMenuSelect";
import { ModConfigMenuRange } from "~/entities/menu/mcm/entities/ModConfigMenuRange";
import { ModConfigMenuSubheading } from "~/entities/menu/mcm/entities/ModConfigMenuSubheading";
import { ModConfigMenuHeading } from "~/entities/menu/mcm/entities/ModConfigMenuHeading";
import { ModConfigMenuSpace } from "~/entities/menu/mcm/entities/ModConfigMenuSpace";

export class ModConfigMenu implements Menu {
  public constructor(private readonly ctx: ModConfigMenuContext) {}

  public heading(heading: MenuHeading): this {
    return this.register(new ModConfigMenuHeading(heading));
  }

  public subheading(subheading: MenuSubheading): this {
    return this.register(new ModConfigMenuSubheading(subheading));
  }

  public range(range: MenuRange): this {
    return this.register(new ModConfigMenuRange(range));
  }

  public select<TValue>(select: MenuSelect<TValue>): this {
    return this.register(new ModConfigMenuSelect(select));
  }

  public readonly(readonlyValue: MenuReadonlyValue): this {
    return this.register(new ModConfigMenuReadonlyValue(readonlyValue));
  }

  public toggle(toggle: MenuToggle): this {
    return this.register(new ModConfigMenuToggle(toggle));
  }

  public space(): this {
    return this.register(new ModConfigMenuSpace());
  }

  public register(entity: MenuEntity<ModConfigMenuContext>): this {
    entity.register(this.ctx);
    return this;
  }
}
