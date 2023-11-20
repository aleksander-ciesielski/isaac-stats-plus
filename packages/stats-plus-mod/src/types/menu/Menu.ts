import type { MenuHeading } from "~/types/menu/entities/MenuHeading";
import type { MenuSubheading } from "~/types/menu/entities/MenuSubheading";
import type { MenuRange } from "~/types/menu/entities/MenuRange";
import type { MenuSelect } from "~/types/menu/entities/MenuSelect";
import type { MenuReadonlyValue } from "~/types/menu/entities/MenuReadonlyValue";
import type { MenuToggle } from "~/types/menu/entities/MenuToggle";
import type { MenuEntity } from "~/types/menu/MenuEntity";
import type { ModConfigMenuContext } from "~/types/menu/mcm/ModConfigMenuContext";

export interface Menu {
  heading(heading: MenuHeading): Menu;
  subheading(subheading: MenuSubheading): Menu;
  range(range: MenuRange): Menu;
  select<TValue>(select: MenuSelect<TValue>): Menu;
  readonly(readonlyValue: MenuReadonlyValue): Menu;
  toggle(toggle: MenuToggle): Menu;
  space(): Menu;
  register(entity: MenuEntity<ModConfigMenuContext>): Menu;
}
