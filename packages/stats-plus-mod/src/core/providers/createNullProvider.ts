import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { NULL_PROVIDER_ID } from "~/core/coreAddonConstants";

export function createNullProvider(statsPlus: StatsPlusAPI.API): StatsPlusAPI.Provider {
  return statsPlus.provider({
    id: NULL_PROVIDER_ID,
    name: "None",
    description: "Displays no value.",
    display: {
      value: {
        get: () => undefined,
        format: () => undefined,
      },
      change: {
        compute: () => undefined,
        format: () => undefined,
      },
    },
    mount: () => undefined,
  });
}
