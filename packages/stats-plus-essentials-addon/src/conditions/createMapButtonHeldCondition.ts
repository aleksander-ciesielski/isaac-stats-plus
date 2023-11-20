import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { ButtonAction, ModCallback } from "isaac-typescript-definitions";
import { MAP_BUTTON_HELD_CONDITION_ID } from "~/essentialsAddonConstants";

export function createMapButtonHeldCondition(
  api: StatsPlusAPI.API,
  mod: Mod,
): StatsPlusAPI.StandaloneConditionDefinition {
  return api.condition({
    id: MAP_BUTTON_HELD_CONDITION_ID,
    name: "Map button is held",
    description: "Activates when the map button is held down and is inactive otherwise.",
    mount(ctx) {
      const listener = (): undefined => {
        if (Game().IsPaused()) {
          return;
        }

        ctx.setActive(
          Input.IsActionPressed(ButtonAction.MAP, ctx.player.ControllerIndex),
        );
      };

      mod.AddCallback(ModCallback.INPUT_ACTION, listener);
      return () => mod.RemoveCallback(ModCallback.INPUT_ACTION, listener);
    },
  });
}
