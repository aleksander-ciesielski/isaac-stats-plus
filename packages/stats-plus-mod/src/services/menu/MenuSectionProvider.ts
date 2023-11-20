import type { MenuSection } from "~/types/menu/MenuSection";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { MenuGeneralSection } from "~/services/menu/sections/MenuGeneralSection";
import { MenuLoadoutSection } from "~/services/menu/sections/MenuLoadoutSection";
import { MenuProvidersSection } from "~/services/menu/sections/MenuProvidersSection";

@Singleton()
export class MenuSectionProvider {
  public constructor(
    @Inject(MenuGeneralSection) private readonly menuGeneralSection: MenuGeneralSection,
    @Inject(MenuLoadoutSection) private readonly menuLoadoutSection: MenuLoadoutSection,
    @Inject(MenuProvidersSection) private readonly menuProvidersSection: MenuProvidersSection,
  ) {}

  public getMenuSections(): MenuSection[] {
    return [
      this.menuGeneralSection,
      this.menuLoadoutSection,
      this.menuProvidersSection,
    ];
  }
}
