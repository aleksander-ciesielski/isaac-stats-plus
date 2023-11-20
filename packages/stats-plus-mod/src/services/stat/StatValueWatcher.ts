import type { Player } from "~/entities/player/Player";
import type { StatExtension } from "~/entities/extension/stat/StatExtension";
import { ModCallback } from "isaac-typescript-definitions";
import { toFixedFormatted } from "@isaac-stats-plus/common";
import { MetricValue } from "~/entities/metric/MetricValue";
import { StatSlot } from "~/entities/stat/StatSlot";
import { Inject } from "~/app/ioc/decorators/Inject";
import { PlayerService } from "~/services/PlayerService";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { CORE_STAT_EXTENSIONS } from "~/data/stat/CORE_STAT_EXTENSIONS";
import { HashMap } from "~/structures/HashMap";
import { ModCallbackService } from "~/services/menu/ModCallbackService";
import { MetricChange } from "~/entities/metric/MetricChange";
import { TimeProvider } from "~/services/renderer/TimeProvider";
import { ErrorWithContext } from "~/errors/ErrorWithContext";
import { speed } from "~/core/stats/speed";
import { tears } from "~/core/stats/tears";
import { damage } from "~/core/stats/damage";
import { range } from "~/core/stats/range";
import { shotSpeed } from "~/core/stats/shotSpeed";
import { luck } from "~/core/stats/luck";

@Singleton()
export class StatValueWatcher {
  private static getNumericStatValue(entityPlayer: EntityPlayer, stat: StatExtension): number {
    if (stat === speed) {
      return Math.min(2, entityPlayer.MoveSpeed);
    }

    if (stat === tears) {
      return 30 / (entityPlayer.MaxFireDelay + 1);
    }

    if (stat === damage) {
      return entityPlayer.Damage;
    }

    if (stat === range) {
      return entityPlayer.TearRange / 40;
    }

    if (stat === shotSpeed) {
      return entityPlayer.ShotSpeed;
    }

    if (stat === luck) {
      return entityPlayer.Luck;
    }

    throw new ErrorWithContext("Unsupported stat.", { stat });
  }

  private readonly values = new HashMap<StatSlot, MetricValue<number>>();

  private readonly onCacheEvaluationCallback = this.onCacheEvaluation.bind(this);
  private readonly onPostUpdateCallback = this.onPostUpdate.bind(this);

  private playersToUpdate = new Set<Player>();

  public constructor(
    @Inject(ModCallbackService) private readonly modCallbackService: ModCallbackService,
    @Inject(TimeProvider) private readonly timeProvider: TimeProvider,
    @Inject(PlayerService) private readonly playerService: PlayerService,
  ) {}

  public reload(): void {
    this.values.clear();
    this.playersToUpdate = new Set(this.playerService.getPlayers());

    this.modCallbackService.removeCallback(ModCallback.EVALUATE_CACHE, this.onCacheEvaluationCallback);
    this.modCallbackService.removeCallback(ModCallback.POST_UPDATE, this.onPostUpdateCallback);

    this.modCallbackService.addCallback(ModCallback.POST_UPDATE, this.onPostUpdateCallback);
    this.modCallbackService.addCallback(ModCallback.EVALUATE_CACHE, this.onCacheEvaluationCallback);
  }

  public getStatValue(slot: StatSlot): MetricValue<number> | undefined {
    return this.values.get(slot);
  }

  private onCacheEvaluation(entityPlayer: EntityPlayer): void {
    const player = this.playerService.getPlayerByEntity(entityPlayer);
    if (player === undefined) {
      return;
    }

    this.playersToUpdate.add(player);
  }

  private onPostUpdate(): void {
    this.playersToUpdate.forEach((player) => {
      this.updatePlayer(player);
    });

    this.playersToUpdate.clear();
  }

  private updatePlayer(player: Player): void {
    CORE_STAT_EXTENSIONS.forEach((statType) => {
      const slot = new StatSlot(statType, player);
      const currentValue = this.getStatValue(slot);
      const currentNumericValue = StatValueWatcher.getNumericStatValue(player.entityPlayer, statType);

      if (currentValue === undefined) {
        const statValue = new MetricValue({
          initial: currentNumericValue,
          computeChange: (prev, next) => {
            const value = (next - prev);
            if (value === 0) {
              return MetricChange.empty(this.timeProvider.getLastRenderTime());
            }

            return new MetricChange(
              value,
              toFixedFormatted(value, 2),
              (value > 0),
              this.timeProvider.getLastRenderTime(),
            );
          },
          formatValue: (value) => toFixedFormatted(value, 2),
          formatChange: (value) => toFixedFormatted(value, 2),
        });

        this.values.set(slot, statValue);

        return;
      }

      if (currentNumericValue !== currentValue.getValue()) {
        currentValue.setValue(currentNumericValue, this.timeProvider.getLastRenderTime());
      }
    });
  }
}
