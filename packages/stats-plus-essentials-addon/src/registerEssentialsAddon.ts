import type * as jsonModule from "json";
import { ESSENTIALS_ADDON_ID } from "~/essentialsAddonConstants";
import { createDamageMultiplierProvider } from "~/providers/damageMultiplierProvider/createDamageMultiplierProvider";
import { createD8MultiplierProvider } from "~/providers/d8MultiplierProvider/createD8MultiplierProvider";
import { createMapButtonHeldCondition } from "~/conditions/createMapButtonHeldCondition";
import { createToggledViaDropButtonCondition } from "~/conditions/createToggledViaDropButtonCondition";

export function registerEssentialsAddon(mod: Mod, json: typeof jsonModule): void {
  mod.AddCallback("STATS_PLUS_REGISTER", (api) => {
    api.register({
      id: ESSENTIALS_ADDON_ID,
      name: "Stats+ Essentials",
      providers: [
        createDamageMultiplierProvider(api, mod, json),
        createD8MultiplierProvider(api, mod, json),
      ],
      conditions: [
        createMapButtonHeldCondition(api, mod),
        createToggledViaDropButtonCondition(api, mod),
      ],
    });
  });
}
