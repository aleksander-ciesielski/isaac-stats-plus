import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { CollectibleType, TrinketType } from "isaac-typescript-definitions";
import type * as jsonModule from "json";
import { ModCallback } from "isaac-typescript-definitions";
import { toFixedFormatted } from "@isaac-stats-plus/common";
import { characterMultipliers } from "~/providers/damageMultiplierProvider/data/characterMultipliers";
import { collectibleMultipliers } from "~/providers/damageMultiplierProvider/data/collectibleMultipliers";
import { trinketMultipliers } from "~/providers/damageMultiplierProvider/data/trinketMultipliers";
import { DAMAGE_MULTIPLIER_PROVIDER_ID } from "~/essentialsAddonConstants";
import { D8Tracker } from "~/common/D8Tracker";

export function createDamageMultiplierProvider(
  api: StatsPlusAPI.API,
  mod: Mod,
  json: typeof jsonModule,
): StatsPlusAPI.Provider {
  const NEUTRAL_MULTIPLIER = 1 as number;

  return api.provider({
    id: DAMAGE_MULTIPLIER_PROVIDER_ID,
    name: "Damage Multiplier",
    description: "Displays a damage multiplier based on the character, items and trinkets.",
    targets: [api.stat.damage],
    color: "RED",
    state: {
      multiplier: {
        initial: () => NEUTRAL_MULTIPLIER,
      },
      seed: {
        initial: () => Game().GetSeeds().GetStartSeed(),
        persistent: true,
      },
      d8Multipliers: {
        initial: () => [] as number[],
        persistent: true,
      },
    },
    display: {
      value: {
        get: (state) => state.multiplier,
        format: (multiplier) => `x${toFixedFormatted(multiplier, 2)}`,
      },
      change: {
        compute: (prev, next) => (
          (next === prev)
            ? undefined
            : (next / prev)
        ),
        isPositive: (multiplier) => (multiplier > 1),
        format: (multiplier) => `x${toFixedFormatted(multiplier, 2)}`,
      },
    },
    conditions: {
      isMultiplierNeutral: {
        id: "neutral-multiplier",
        name: "Damage multiplier is x1.00",
        description: "Activates when the damage multiplier is x1.00.",
      },
      isMultiplierAltered: {
        id: "altered-multiplier",
        name: "Damage multiplier is altered",
        description: "Activates when the damage multiplier is affected by some item or trinket.",
      },
    },
    settings: {
      trackD8: api.settings.toggle({
        name: "D8 support",
        description: "If enabled, the D8 damage multiplier will be considered when calculating the damage multiplier.",
        initial: () => true,
      }),
    },
    computables: {
      getCharacterMultiplier(entityPlayer: EntityPlayer): number {
        return characterMultipliers.get(entityPlayer.GetPlayerType())?.(entityPlayer) ?? NEUTRAL_MULTIPLIER;
      },
      getAffectedCollectibles(): CollectibleType[] {
        return Array.from(collectibleMultipliers.keys());
      },
      getCollectibleMultiplier(collectible: CollectibleType, entityPlayer: EntityPlayer): number {
        return collectibleMultipliers.get(collectible)?.(entityPlayer) ?? NEUTRAL_MULTIPLIER;
      },
      getTotalCollectibleMultiplier(entityPlayer: EntityPlayer): number {
        const affectedCollectibles = Array.from(new Set(this.getAffectedCollectibles()));
        return affectedCollectibles.reduce(
          (acc, collectible) => (
            (entityPlayer.HasCollectible(collectible) || entityPlayer.GetEffects().HasCollectibleEffect(collectible))
              ? (acc * this.getCollectibleMultiplier(collectible, entityPlayer))
              : (acc * NEUTRAL_MULTIPLIER)
          ),
          NEUTRAL_MULTIPLIER,
        );
      },
      getAffectedTrinkets(): TrinketType[] {
        return Array.from(trinketMultipliers.keys());
      },
      getTrinketMultiplier(trinket: TrinketType, entityPlayer: EntityPlayer): number {
        return trinketMultipliers.get(trinket)?.(entityPlayer) ?? NEUTRAL_MULTIPLIER;
      },
      getTotalTrinketMultiplier(entityPlayer: EntityPlayer): number {
        const affectedTrinkets = Array.from(new Set(this.getAffectedTrinkets()));
        return affectedTrinkets.reduce((acc, trinket) => {
          if (!entityPlayer.HasTrinket(trinket)) {
            return acc * NEUTRAL_MULTIPLIER;
          }

          return acc * this.getTrinketMultiplier(trinket, entityPlayer);
        }, NEUTRAL_MULTIPLIER);
      },
      getTotalMultiplier(multipliers: number[]): number {
        return multipliers.reduce((acc, multiplier) => acc * multiplier, NEUTRAL_MULTIPLIER);
      },
    },
    mount(ctx) {
      if (ctx.state.seed.current() !== Game().GetSeeds().GetStartSeed()) {
        ctx.state.d8Multipliers.reset();
        ctx.state.seed.set(Game().GetSeeds().GetStartSeed());
      }

      function recomputeMultiplier(silent: boolean = false): void {
        try {
          const characterMultiplier = ctx.computables.getCharacterMultiplier(ctx.player);
          const collectibleMultiplier = ctx.computables.getTotalCollectibleMultiplier(ctx.player);
          const trinketMultiplier = ctx.computables.getTotalTrinketMultiplier(ctx.player);

          const totalMultiplier = ctx.computables.getTotalMultiplier([
            characterMultiplier,
            collectibleMultiplier,
            trinketMultiplier,
            ctx.settings.custom.trackD8
              ? ctx.state.d8Multipliers.current()[ctx.playerIndex] ?? NEUTRAL_MULTIPLIER
              : NEUTRAL_MULTIPLIER,
          ]);

          ctx.state.multiplier.set(totalMultiplier, silent);
          ctx.conditions.isMultiplierNeutral.setActive(totalMultiplier === NEUTRAL_MULTIPLIER);
          ctx.conditions.isMultiplierAltered.setActive(totalMultiplier !== characterMultiplier);
        } catch (e) {
          Isaac.DebugString(`Error during damage multiplier recomputation: ${json.encode(e)}`);
        }
      }

      const listener = (entityPlayer: EntityPlayer): void => {
        if (entityPlayer.Index === ctx.player.Index) {
          recomputeMultiplier();
        }
      };

      const d8Tracker = new D8Tracker(
        api,
        mod,
        json,
        ctx.player,
        api.stat.damage,
        ctx.state.d8Multipliers.current()[ctx.playerIndex] ?? NEUTRAL_MULTIPLIER,
        () => {
          if (!ctx.settings.custom.trackD8) {
            return;
          }

          const d8Multipliers = ctx.state.d8Multipliers.current();
          d8Multipliers[ctx.playerIndex] = d8Tracker.getMultiplier();
          ctx.state.d8Multipliers.set(d8Multipliers);

          recomputeMultiplier();
        },
      );

      recomputeMultiplier(true);

      mod.AddCallback(ModCallback.EVALUATE_CACHE, listener);
      return () => mod.RemoveCallback(ModCallback.EVALUATE_CACHE, listener);
    },
  });
}
