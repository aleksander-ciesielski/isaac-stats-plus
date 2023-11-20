import { StatExtension } from "~/entities/extension/stat/StatExtension";
import { CORE_ADDON_ID } from "~/core/coreAddonConstants";

export const shotSpeed = new StatExtension({
  addon: CORE_ADDON_ID,
  id: "shot-speed-stat",
});
