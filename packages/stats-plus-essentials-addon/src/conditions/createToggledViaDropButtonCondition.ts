import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { ButtonAction, ModCallback } from "isaac-typescript-definitions";
import { DROP_BUTTON_TOGGLED_CONDITION_ID } from "~/essentialsAddonConstants";

export function createToggledViaDropButtonCondition(
  api: StatsPlusAPI.API,
  mod: Mod,
): StatsPlusAPI.StandaloneConditionDefinition {
  return api.condition({
    id: DROP_BUTTON_TOGGLED_CONDITION_ID,
    name: "Toggled via the drop button",
    description: "Activates/deactivates when the drop button is pressed.",
    mount(ctx) {
      let pressed = false;

      const listener = (): undefined => {
        if (pressed && !Input.IsActionPressed(ButtonAction.DROP, ctx.player.ControllerIndex)) {
          pressed = false;
          return;
        }

        if (pressed || Game().IsPaused() || !Input.IsActionPressed(ButtonAction.DROP, ctx.player.ControllerIndex)) {
          return;
        }

        ctx.setActive(!ctx.isActive());
        pressed = true;
      };

      mod.AddCallback(ModCallback.INPUT_ACTION, listener);
      return () => mod.RemoveCallback(ModCallback.INPUT_ACTION, listener);
    },
  });
}
