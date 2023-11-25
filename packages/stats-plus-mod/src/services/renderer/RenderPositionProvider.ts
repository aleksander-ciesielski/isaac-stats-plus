import type { Position } from "~/types/renderer/Position";
import type { PositionTransformer } from "~/types/renderer/PositionTransformer";
import type { Player } from "~/entities/player/Player";
import type { StatSlot } from "~/entities/stat/StatSlot";
import type { StatExtension } from "~/entities/extension/stat/StatExtension";
import { Challenge, Difficulty, PlayerType } from "isaac-typescript-definitions";
import { PlayerService } from "~/services/PlayerService";
import { FontFactory } from "~/services/renderer/FontFactory";
import { ConfigService } from "~/services/config/ConfigService";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { ErrorWithContext } from "~/errors/ErrorWithContext";
import { InjectionToken } from "~/app/ioc/InjectionToken";
import { speed } from "~/core/stats/speed";
import { tears } from "~/core/stats/tears";
import { damage } from "~/core/stats/damage";
import { range } from "~/core/stats/range";
import { shotSpeed } from "~/core/stats/shotSpeed";
import { luck } from "~/core/stats/luck";

@Singleton()
export class RenderPositionProvider {
  private readonly statFont: Font;

  public constructor(
    @Inject(InjectionToken.IsaacAPI) private readonly isaac: typeof Isaac,
    @Inject(InjectionToken.GameAPI) private readonly game: Game,
    @Inject(PlayerService) private readonly playerService: PlayerService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(FontFactory) private readonly fontFactory: FontFactory,
  ) {
    this.statFont = this.fontFactory.create("font/luaminioutlined.fnt");
  }

  public getPosition(
    slot: StatSlot,
    statText: string | undefined,
  ): Position {
    return this.getTransformedPosition(
      slot,
      statText,
      this.getBasePositionFor(slot.stat),
    );
  }

  private getBasePositionFor(stat: StatExtension): Position {
    if (this.playerService.getMainPlayer()?.entityPlayer.GetPlayerType() === PlayerType.JACOB) {
      return this.getJacobAndEsauBasePosition(stat);
    }

    if (this.playerService.getPlayers().length > 1) {
      return this.getMultiplePlayersBasePosition(stat);
    }

    return this.getSinglePlayerBasePosition(stat);
  }

  private getJacobAndEsauBasePosition(stat: StatExtension): Position {
    if (stat === speed) return [17, 87];
    if (stat === tears) return [17, 96];
    if (stat === damage) return [17, 110];
    if (stat === range) return [17, 124];
    if (stat === shotSpeed) return [17, 138];
    if (stat === luck) return [17, 152];

    throw new ErrorWithContext("Unsupported stat.", { stat });
  }

  private getMultiplePlayersBasePosition(stat: StatExtension): Position {
    if (stat === speed) return [17, 84];
    if (stat === tears) return [17, 98];
    if (stat === damage) return [17, 112];
    if (stat === range) return [17, 126];
    if (stat === shotSpeed) return [17, 140];
    if (stat === luck) return [17, 154];

    throw new ErrorWithContext("Unsupported stat.", { stat });
  }

  private getSinglePlayerBasePosition(stat: StatExtension): Position {
    if (stat === speed) return [17, 88];
    if (stat === tears) return [17, 100];
    if (stat === damage) return [17, 112];
    if (stat === range) return [17, 124];
    if (stat === shotSpeed) return [17, 136];
    if (stat === luck) return [17, 148];

    throw new ErrorWithContext("Unsupported stat.", { stat });
  }

  private getTransformedPosition(
    slot: StatSlot,
    statText: string | undefined,
    basePosition: Position,
  ): Position {
    return [
      this.createPlayerIndexTransformer(slot.player.index),
      this.createTextLengthTransformer(statText),
      this.createScreenShakeOffsetTransformer(),
      this.createBethanyTransformer(),
      this.createJacobTransformer(),
      this.createIconTransformer(),
      this.createConfigSpacingTransformer(),
    ].reduce((acc, transformer) => transformer(acc), basePosition);
  }

  private createIconTransformer(): PositionTransformer {
    return ([x, y]) => {
      if (
        this.game.Difficulty === Difficulty.NORMAL
        && this.isaac.GetChallenge() === Challenge.NULL
        && this.canUnlockAchievements()
      ) {
        return [x, y - 16];
      }

      return [x, y];
    };
  }

  private createJacobTransformer(): PositionTransformer {
    return ([x, y]) => {
      if (this.isaac.GetPlayer(0).GetPlayerType() === PlayerType.JACOB) {
        return [x, y + 16];
      }

      return [x, y];
    };
  }

  private createScreenShakeOffsetTransformer(): PositionTransformer {
    return ([x, y]) => [
      x + this.game.ScreenShakeOffset.X + Options.HUDOffset * 20,
      y + this.game.ScreenShakeOffset.Y + Options.HUDOffset * 12,
    ];
  }

  private createBethanyTransformer(): PositionTransformer {
    function isBethany(player: Player): boolean {
      return (
        player.entityPlayer.GetPlayerType() === PlayerType.BETHANY
        || player.entityPlayer.GetPlayerType() === PlayerType.BETHANY_B
      );
    }

    return ([x, y]) => {
      if (this.playerService.getPlayers().some(isBethany)) {
        return [x, y + 9];
      }

      return [x, y];
    };
  }

  private createPlayerIndexTransformer(playerIndex: number): PositionTransformer {
    return ([x, y]) => {
      if (playerIndex > 0) {
        return [x + 4, y + 7];
      }

      return [x, y];
    };
  }

  private createTextLengthTransformer(text: string | undefined): PositionTransformer {
    return ([x, y]) => {
      if (text === undefined) {
        return [x, y];
      }

      const textWidth = text
        .split("")
        .reduce(
          (acc, char) => acc + this.statFont.GetCharacterWidth(char),
          0,
        );

      return [x + textWidth, y];
    };
  }

  private createConfigSpacingTransformer(): PositionTransformer {
    return ([x, y]) => [x + this.configService.getConfig().appearance.getSpacing(), y];
  }

  // Source: https://github.com/Sectimus/isaac-planetarium-chance/blob/b703c0e0bf28f3d3f6252b829e7ec6adb6d1d7d2/main.lua#L308
  private canUnlockAchievements(): boolean {
    const machine = Isaac.Spawn(6, 11, 0, Vector(0, 0), Vector(0, 0), undefined);
    const achievementsEnabled = machine.Exists();
    machine.Remove();

    return achievementsEnabled;
  }
}
