import { StatExtension } from "~/entities/extension/stat/StatExtension";
import { CORE_ADDON_ID } from "~/core/coreAddonConstants";

export const tears = new StatExtension({
  addon: CORE_ADDON_ID,
  id: "tears-stat",
});
