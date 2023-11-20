import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { ALWAYS_CONDITION_ID } from "~/core/coreAddonConstants";

export function createAlwaysCondition(statsPlus: StatsPlusAPI.API): StatsPlusAPI.StandaloneConditionDefinition {
  return statsPlus.condition({
    id: ALWAYS_CONDITION_ID,
    name: "Always",
    description: "Always active.",
    mount(ctx): undefined {
      ctx.setActive(true);
    },
  });
}
