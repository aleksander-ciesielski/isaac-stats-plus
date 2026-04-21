import {
  CallbackPriority, LevelStage, ModCallback, RoomType, SeedEffect,
} from "isaac-typescript-definitions";
import { Renderer } from "~/services/renderer/Renderer";
import { PlayerService } from "~/services/PlayerService";
import { Logger } from "~/Logger";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { ModCallbackService } from "~/services/ModCallbackService";
import { TimeProvider } from "~/services/renderer/TimeProvider";
import { InjectionToken } from "~/app/ioc/InjectionToken";

@Singleton()
export class RenderService {
  private readonly logger = Logger.for(RenderService.name);

  private readonly onPostRenderCallback = this.onPostRender.bind(this);

  public constructor(
    @Inject(InjectionToken.GameAPI) private readonly game: Game,
    @Inject(InjectionToken.OptionsAPI) private readonly options: typeof Options,
    @Inject(ModCallbackService) private readonly modCallbackService: ModCallbackService,
    @Inject(TimeProvider) private readonly timeProvider: TimeProvider,
    @Inject(PlayerService) private readonly playerService: PlayerService,
    @Inject(Renderer) private readonly renderer: Renderer,
  ) {}

  public reload(): void {
    this.timeProvider.reload();

    this.modCallbackService.removeCallback(
      ModCallback.POST_RENDER,
      this.onPostRenderCallback,
    );

    this.modCallbackService.addPriorityCallback(
      ModCallback.POST_RENDER,
      CallbackPriority.IMPORTANT,
      this.onPostRenderCallback,
    );
  }

  private onPostRender(): void {
    if (this.shouldRender()) {
      this.render();
    }
  }

  private render(): void {
    const players = this.playerService.getPlayers();

    try {
      this.renderer.render(players);
    } catch (e) {
      this.logger.error("Error during render.", e);
      throw e;
    }
  }

  private shouldRender(): boolean {
    // Based on https://github.com/Sectimus/isaac-planetarium-chance/blob/2360aede25d239a35a927bbf55c27af2a473149d/main.lua#L120
    return (
      this.options.FoundHUD
      && this.game.GetHUD().IsVisible()
      // eslint-disable-next-line max-len
      && (this.game.GetRoom().GetType() !== RoomType.DUNGEON || this.game.GetLevel().GetAbsoluteStage() !== LevelStage.HOME)
      && !this.game.GetSeeds().HasSeedEffect(SeedEffect.NO_HUD)
    );
  }
}
