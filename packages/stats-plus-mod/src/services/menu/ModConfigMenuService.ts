import type { IngameValue } from "~/services/IngameValue";
import { Logger } from "~/Logger";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { ModConfigMenu } from "~/entities/menu/mcm/ModConfigMenu";
import { MenuSectionProvider } from "~/services/menu/MenuSectionProvider";
import { InjectionToken } from "~/app/ioc/InjectionToken";

@Singleton()
export class ModConfigMenuService {
  private static readonly CATEGORY_NAME = "Stats+";
  private static readonly CATEGORY_DESCRIPTION = "Choose what, how, and when to display Stats+ data.";

  private readonly logger = Logger.for(ModConfigMenuService.name);

  public constructor(
    @Inject(InjectionToken.ModConfigMenu) private readonly modConfigMenu: IngameValue<ModConfigMenuInterface | undefined>,
    @Inject(MenuSectionProvider) private readonly menuSectionProvider: MenuSectionProvider,
  ) {}

  public reload(): void {
    this.logger.info("Waiting for the ModConfigMenuProviderService...");

    this.modConfigMenu.get((modConfigMenu) => {
      if (modConfigMenu === undefined) {
        this.logger.info("No Mod Config Menu is present, skipping the registration of ModConfigMenuService.");
        return;
      }

      this.logger.info("Registering Mod Config Menu.", { modConfigMenuVersion: modConfigMenu.Version });
      this.registerModConfigMenu(modConfigMenu);
    });
  }

  private registerModConfigMenu(modConfigMenu: ModConfigMenuInterface): void {
    modConfigMenu.RemoveCategory(ModConfigMenuService.CATEGORY_NAME);
    modConfigMenu.UpdateCategory(ModConfigMenuService.CATEGORY_NAME, {
      Name: ModConfigMenuService.CATEGORY_NAME,
      Info: ModConfigMenuService.CATEGORY_DESCRIPTION,
      IsOld: false,
    });

    this.menuSectionProvider.getMenuSections().forEach((section) => {
      const menu = new ModConfigMenu({
        modConfigMenu,
        category: ModConfigMenuService.CATEGORY_NAME,
        subcategory: section.getIdentifier(),
      });

      section.register(menu);
    });
  }
}
