import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import { toFixedFormatted } from "@isaac-stats-plus/common";
import { TEAR_CAP_PROVIDER_ID } from "~/essentialsAddonConstants";
import { debounce } from "~/debounce";

type TearCap =
  | number
  | "MAX"
  | "UNKNOWN";

function fireDelayToTears(fireDelay: number): number {
  return 30 / (fireDelay + 1);
}

export function createTearCapProvider(
  api: StatsPlusAPI.API,
  mod: Mod,
): StatsPlusAPI.Provider {
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
  const RECOMPUTE_DEBOUNCE_MS = 3_000;

  return api.provider({
    id: TEAR_CAP_PROVIDER_ID,
    name: "Tear Cap",
    description: "Displays maximum tears value.",
    targets: [api.stat.tears],
    color: "GREEN",
    state: {
      maxFireDelay: {
        initial: () => 0 as TearCap,
      },
    },
    display: {
      value: {
        get: (state) => state.maxFireDelay,
        format: (cap) => {
          if (cap === "MAX") {
            return TEXT_MAX;
          }

          if (cap === "UNKNOWN") {
            return undefined;
          }

          return `/${toFixedFormatted(fireDelayToTears(cap), 2)}`;
        },
      },
      change: {
        compute: (prev, next) => (
          (typeof prev === "number" && typeof next === "number" && prev !== next)
            ? (fireDelayToTears(next) - fireDelayToTears(prev))
            : undefined
        ),
        isPositive: (diff) => (typeof diff === "number" && diff > 0),
        format: (diff) => (
          (typeof diff === "number" && diff !== 0)
            ? `${diff > 0 ? "+" : ""}${toFixedFormatted(diff, 2)}`
            : undefined
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
    computables: {
      getTearCapTestCollectible(player: EntityPlayer): CollectibleType | undefined {
        if (player.HasCollectible(CollectibleType.ROCK_BOTTOM)) {
          return undefined;
        }

        return TEST_COLLECTIBLES.find((collectible) => !player.HasCollectible(collectible));
      },
      computeTearCap(player: EntityPlayer): TearCap {
        const collectible = this.getTearCapTestCollectible(player);
        if (collectible === undefined) {
          return "UNKNOWN";
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

        return (count === 1)
          ? "MAX"
          : current;
      },
    },
    mount(ctx) {
      const recomputeCap = debounce(RECOMPUTE_DEBOUNCE_MS, (silent: boolean) => {
        const cap = ctx.computables.computeTearCap(ctx.player);

        ctx.state.maxFireDelay.set(cap, silent);
        ctx.conditions.isMax.setActive(cap === "MAX");
      });

      let recompute = false;
      function updateListener(): void {
        if (!recompute) {
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
