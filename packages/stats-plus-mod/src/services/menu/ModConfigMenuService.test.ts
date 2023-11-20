import type { MenuSection } from "~/types/menu/MenuSection";
import type { MenuSectionProvider } from "~/services/menu/MenuSectionProvider";
import type { IngameValue } from "~/services/IngameValue";
import { mock } from "vitest-mock-extended";
import { ModConfigMenuService } from "~/services/menu/ModConfigMenuService";

const modConfigMenuProviderService = mock<IngameValue<ModConfigMenuInterface | undefined>>();

describe("ModConfigMenuService", () => {
  function createModConfigMenuService(sections: MenuSection[]): ModConfigMenuService {
    const menuSectionProvider = mock<MenuSectionProvider>();
    menuSectionProvider.getMenuSections.mockReturnValue(sections);

    return new ModConfigMenuService(modConfigMenuProviderService, menuSectionProvider);
  }

  describe("reload", () => {
    it("initializes the given subcategories once Mod Config Menu is ready.", () => {
      const subcategoryA = mock<MenuSection>();
      const subcategoryB = mock<MenuSection>();
      modConfigMenuProviderService.get.mockImplementation((callback) => callback(mock<ModConfigMenuInterface>()));

      const modConfigMenuService = createModConfigMenuService([subcategoryA, subcategoryB]);
      modConfigMenuService.reload();

      expect(subcategoryA.register).toHaveBeenCalledTimes(1);
      expect(subcategoryB.register).toHaveBeenCalledTimes(1);
    });

    it("does not initialize subcategories if Mod Config Menu is unavailable.", () => {
      const subcategoryA = mock<MenuSection>();
      const subcategoryB = mock<MenuSection>();
      modConfigMenuProviderService.get.mockImplementation((callback) => callback(undefined));

      const modConfigMenuService = createModConfigMenuService([subcategoryA, subcategoryB]);
      modConfigMenuService.reload();

      expect(subcategoryA.register).toHaveBeenCalledTimes(0);
      expect(subcategoryB.register).toHaveBeenCalledTimes(0);
    });
  });
});
