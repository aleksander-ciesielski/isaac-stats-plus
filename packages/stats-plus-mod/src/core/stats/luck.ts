import { StatExtension } from "~/entities/extension/stat/StatExtension";
import { CORE_ADDON_ID } from "~/core/coreAddonConstants";

export const luck = new StatExtension({
  addon: CORE_ADDON_ID,
  id: "luck-stat",
});
