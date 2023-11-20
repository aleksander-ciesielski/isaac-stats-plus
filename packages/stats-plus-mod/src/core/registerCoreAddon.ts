import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { CORE_ADDON_ID } from "~/core/coreAddonConstants";
import { createNullProvider } from "~/core/providers/createNullProvider";
import { createAlwaysCondition } from "~/core/conditions/createAlwaysCondition";

export function registerCoreAddon(mod: Mod): void {
  mod.AddCallback("STATS_PLUS_REGISTER", (statsPlus: StatsPlusAPI.API) => {
    statsPlus.register({
      id: CORE_ADDON_ID,
      name: "Stats+ Core",
      providers: [
        createNullProvider(statsPlus),
      ],
      conditions: [
        createAlwaysCondition(statsPlus),
      ],
    });
  });
}
