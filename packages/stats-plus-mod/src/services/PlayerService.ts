import { BabySubType, ModCallback, PlayerType } from "isaac-typescript-definitions";
import { Logger } from "~/Logger";
import { LifecycleService } from "~/services/LifecycleService";
import { Player } from "~/entities/player/Player";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { ModCallbackService } from "~/services/menu/ModCallbackService";
import { InjectionToken } from "~/app/ioc/InjectionToken";

@Singleton()
export class PlayerService {
  private readonly onPostPlayerInitCallback = this.onPostPlayerInit.bind(this);
  private readonly onPostUpdateCallback = this.onPostUpdate.bind(this);

  private readonly logger = Logger.for(PlayerService.name);

  private players: Player[] = [];
  private recomputePlayersOnNextTick = false;

  public constructor(
    @Inject(InjectionToken.IsaacAPI) private readonly isaac: typeof Isaac,
    @Inject(InjectionToken.GameAPI) private readonly game: Game,
    @Inject(ModCallbackService) private readonly modCallbackService: ModCallbackService,
    @Inject(LifecycleService) private readonly lifecycleService: LifecycleService,
  ) {}

  public getMainPlayer(): Player | undefined {
    return this.getPlayers().find((player) => player.isMainPlayer());
  }

  public getPlayerByEntity(entityPlayer: EntityPlayer): Player | undefined {
    return this.getPlayers().find((player) => (
      entityPlayer.Index === player.entityPlayer.Index
      && entityPlayer.GetPlayerType() === player.entityPlayer.GetPlayerType()
    ));
  }

  public getPlayers(): Player[] {
    return this.players.slice();
  }

  public reload(): void {
    this.modCallbackService.removeCallback(ModCallback.POST_UPDATE, this.onPostUpdateCallback);
    this.modCallbackService.removeCallback(ModCallback.POST_PLAYER_INIT, this.onPostPlayerInitCallback);

    this.modCallbackService.addCallback(ModCallback.POST_PLAYER_INIT, this.onPostPlayerInitCallback);
    this.modCallbackService.addCallback(ModCallback.POST_UPDATE, this.onPostUpdateCallback);

    this.players = this.findActivePlayers();
    this.logger.debug("Recomputed current players.", { playerCount: this.players.length });
  }

  private findActivePlayers(): Player[] {
    const allEntityPlayers = this.getAllEntityPlayers();
    const activeEntityPlayers: EntityPlayer[] = [];
    const controllerIndices = new Set<number>();

    allEntityPlayers.forEach((entityPlayer) => {
      // Skip co-op babies and the Forgotten's alternative entity.
      if (
        entityPlayer.GetBabySkin() !== BabySubType.UNASSIGNED
        || entityPlayer.GetPlayerType() === PlayerType.SOUL_B
      ) {
        return;
      }

      // Skip if there already is a player using the same controller (this will skip Strawman/Soul of the Forgotten/Soul of the Jacob).
      // The only exception is the real Esau (i.e., the previous player is Jacob).
      const previousPlayer = activeEntityPlayers[activeEntityPlayers.length - 1];
      if (
        controllerIndices.has(entityPlayer.ControllerIndex)
        && (entityPlayer.GetPlayerType() !== PlayerType.ESAU || previousPlayer?.GetPlayerType() !== PlayerType.JACOB)
      ) {
        return;
      }

      controllerIndices.add(entityPlayer.ControllerIndex);
      activeEntityPlayers.push(entityPlayer);
    });

    return activeEntityPlayers.map((entityPlayer, idx) => new Player(entityPlayer, idx));
  }

  private getAllEntityPlayers(): EntityPlayer[] {
    const entityPlayers: EntityPlayer[] = [];

    for (let i = 0; i < this.game.GetNumPlayers(); i += 1) {
      const entityPlayer = this.isaac.GetPlayer(i);

      if (entityPlayer !== undefined) {
        entityPlayers.push(entityPlayer);
      }
    }

    return entityPlayers;
  }

  private onPostPlayerInit(): void {
    this.recomputePlayersOnNextTick = true;
  }

  private onPostUpdate(): void {
    if (!this.recomputePlayersOnNextTick) {
      return;
    }

    this.recomputePlayersOnNextTick = false;

    this.logger.info("Requesting a full reload due to the change of active players.");
    this.lifecycleService.reloadAll();
  }
}
