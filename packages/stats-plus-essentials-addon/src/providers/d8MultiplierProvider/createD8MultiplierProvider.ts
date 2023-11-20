import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type * as jsonModule from "json";
import { toFixedFormatted } from "@isaac-stats-plus/common";
import { D8_MULTIPLIER_PROVIDER_ID } from "~/essentialsAddonConstants";
import { D8Tracker } from "~/common/D8Tracker";

export function createD8MultiplierProvider(
  api: StatsPlusAPI.API,
  mod: Mod,
  json: typeof jsonModule,
): StatsPlusAPI.Provider {
  const NEUTRAL_MULTIPLIER = 1 as number;
  const TARGETS = [
    api.stat.speed,
    api.stat.tears,
    api.stat.damage,
    api.stat.range,
  ] satisfies StatsPlusAPI.ExtensionRef[];

  return api.provider({
    id: D8_MULTIPLIER_PROVIDER_ID,
    name: "D8 Multiplier",
    description: "Displays a multiplier applied by D8, ranging from x0.5 to x2.0 (D100 not supported).",
    targets: TARGETS,
    color: "BLUE",
    state: {
      seed: {
        initial: () => Game().GetSeeds().GetStartSeed(),
        persistent: true,
      },
      multipliers: {
        initial: () => [] as Map<string, number>[],
        persistent: true,
        encoder: {
          encode(decoded: Map<string, number>[]): string {
            return json.encode(
              decoded
                .map((map) => Array.from(map.entries())),
            );
          },
          decode(encoded: string): Map<string, number>[] {
            return (json.decode(encoded) as [string, number][][]).map((entries) => new Map(entries));
          },
        },
      },
      multiplier: {
        initial: () => NEUTRAL_MULTIPLIER,
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
    mount(ctx) {
      if (ctx.state.seed.current() !== Game().GetSeeds().GetStartSeed()) {
        ctx.state.multipliers.reset();
        ctx.state.multiplier.reset(true);
        ctx.state.seed.set(Game().GetSeeds().GetStartSeed());
      }

      if (ctx.state.multipliers.current()[ctx.playerIndex] === undefined) {
        const players = Array.from(ctx.state.multipliers.current());
        players[ctx.playerIndex] = new Map();

        ctx.state.multipliers.set(players);
      }

      const tracker = new D8Tracker(
        api,
        mod,
        json,
        ctx.player,
        ctx.stat,
        ctx.state.multipliers.current()[ctx.playerIndex]!.get(ctx.stat.id) ?? NEUTRAL_MULTIPLIER,
        () => {
          const multiplier = tracker.getMultiplier();
          const players = Array.from(ctx.state.multipliers.current());
          const player = new Map(players[ctx.playerIndex] ?? new Map());

          player.set(ctx.stat.id, multiplier);
          players[ctx.playerIndex] = player;
          ctx.state.multipliers.set(players);

          ctx.state.multiplier.set(multiplier);
        },
      );

      ctx.state.multiplier.set(tracker.getMultiplier(), true);

      return () => tracker.destroy();
    },
  });
}
