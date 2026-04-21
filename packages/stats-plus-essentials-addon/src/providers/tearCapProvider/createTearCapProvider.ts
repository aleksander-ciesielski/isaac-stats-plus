import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { toFixedFormatted } from "@isaac-stats-plus/common";
import { TEAR_CAP_PROVIDER_ID } from "~/essentialsAddonConstants";

const TEXT_MAX = "MAX";
const TEST_COLLECTIBLES: CollectibleType[] = [
  CollectibleType.SAD_ONION,
  CollectibleType.NUMBER_ONE,
  CollectibleType.WIRE_COAT_HANGER,
  CollectibleType.TOOTH_PICKS,
  CollectibleType.SCREW,
  CollectibleType.BAR_OF_SOAP,
  CollectibleType.ODD_MUSHROOM_THIN,
];

const EPSILON = 0.001;

function fireDelayToTears(fireDelay: number): number {
  return 30 / (fireDelay + 1);
}

function computeTearCap(player: EntityPlayer): number | undefined {
  const collectible = TEST_COLLECTIBLES.find((collectible) => !player.HasCollectible(collectible));
  if (collectible === undefined) {
    return undefined;
  }

  let current = player.MaxFireDelay;
  let previous: typeof current | undefined;
  let count = 0;

  while (previous === undefined || Math.abs(previous - current) > EPSILON) {
    previous = current;
    player.AddCollectible(collectible, undefined, false);
    current = player.MaxFireDelay;

    count += 1;
  }

  for (let i = 0; i < count; i += 1) {
    player.RemoveCollectible(collectible);
  }

  return (count === 1) ? undefined : current;
}

export function createTearCapProvider(
  api: StatsPlusAPI.API,
  mod: Mod,
): StatsPlusAPI.Provider {
  return api.provider({
    id: TEAR_CAP_PROVIDER_ID,
    name: "Tear Cap",
    description: "Displays maximum tears value.",
    targets: [api.stat.tears],
    color: "GREEN",
    state: {
      maxFireDelay: {
        initial: () => 0 as number | undefined,
      },
    },
    display: {
      value: {
        get: (state) => state.maxFireDelay,
        format: (cap) => (
          (cap === undefined)
            ? TEXT_MAX
            : `/${toFixedFormatted(fireDelayToTears(cap), 2)}`
        ),
      },
      change: {
        compute: (prev, next) => (
          (next === prev || next === undefined || prev === undefined)
            ? undefined
            : (fireDelayToTears(next) - fireDelayToTears(prev))
        ),
        isPositive: (diff) => (diff !== undefined && diff > 0),
        format: (diff) => (
          (diff === undefined)
            ? undefined
            : `${diff > 0 ? "+" : ""}${toFixedFormatted(diff, 2)}`
        ),
      },
    },
    conditions: {
      isMax: {
        id: "is-max",
        name: "Tear cap is reached",
        description: "Activates when the max tear level is reached.",
      },
    },
    mount(ctx) {
      function recomputeCap(silent: boolean): void {
        const cap = computeTearCap(ctx.player);
        const isMax = (cap === undefined);

        ctx.state.maxFireDelay.set(cap, silent);
        ctx.conditions.isMax.setActive(isMax);
      }

      let recompute = false;
      function updateListener(): void {
        if (!recompute || ctx.player === undefined) {
          return;
        }

        recomputeCap(false);
        recompute = false;
      }

      function listener(entityPlayer: EntityPlayer): void {
        if (entityPlayer.Index === ctx.player.Index) {
          recompute = true;
        }
      }

      mod.AddCallback(ModCallback.EVALUATE_CACHE, listener);
      mod.AddCallback(ModCallback.POST_UPDATE, updateListener);
      recomputeCap(true);

      return () => {
        mod.RemoveCallback(ModCallback.EVALUATE_CACHE, listener);
        mod.RemoveCallback(ModCallback.POST_UPDATE, updateListener);
      };
    },
  });
}
