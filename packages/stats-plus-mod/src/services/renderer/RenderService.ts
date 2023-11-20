import {
  CallbackPriority, LevelStage, ModCallback, RoomType, SeedEffect,
} from "isaac-typescript-definitions";
import { Renderer } from "~/services/renderer/Renderer";
import { PlayerService } from "~/services/PlayerService";
import { Logger } from "~/Logger";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { ModCallbackService } from "~/services/menu/ModCallbackService";
import { TimeProvider } from "~/services/renderer/TimeProvider";
import { ConfigService } from "~/services/config/ConfigService";
import { InjectionToken } from "~/app/ioc/InjectionToken";

@Singleton()
export class RenderService {
  private static readonly SHADER_NAME = "STATS_PLUS_SHADER";

  private readonly logger = Logger.for(RenderService.name);

  private readonly onPostRenderCallback = this.onPostRender.bind(this);
  private readonly onGetShaderParamsCallback = this.onGetShaderParams.bind(this);

  private usesShaderColorFix: boolean | undefined;
  private shaderInitialized = false;

  public constructor(
    @Inject(InjectionToken.GameAPI) private readonly game: Game,
    @Inject(InjectionToken.IsaacAPI) private readonly isaac: typeof Isaac,
    @Inject(InjectionToken.OptionsAPI) private readonly options: typeof Options,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(ModCallbackService) private readonly modCallbackService: ModCallbackService,
    @Inject(TimeProvider) private readonly timeProvider: TimeProvider,
    @Inject(PlayerService) private readonly playerService: PlayerService,
    @Inject(Renderer) private readonly renderer: Renderer,
  ) {}

  public reload(): void {
    if (this.usesShaderColorFix === undefined) {
      this.usesShaderColorFix = this.configService.getConfig().appearance.usesShaderColorFix();
    }

    // Based on https://github.com/Sectimus/isaac-planetarium-chance/blob/2360aede25d239a35a927bbf55c27af2a473149d/main.lua#L343
    if (
      this.getMemoizedShaderColorFixUsage()
      && !this.shaderInitialized
      && this.playerService.getMainPlayer() !== undefined
    ) {
      this.isaac.ExecuteCommand("reloadshaders");
      this.shaderInitialized = true;
    }

    this.timeProvider.reload();

    this.modCallbackService.removeCallback(
      ModCallback.POST_RENDER,
      this.onPostRenderCallback,
    );

    this.modCallbackService.removeCallback(
      ModCallback.GET_SHADER_PARAMS,
      this.onGetShaderParamsCallback,
    );

    this.modCallbackService.addPriorityCallback(
      ModCallback.POST_RENDER,
      CallbackPriority.IMPORTANT,
      this.onPostRenderCallback,
    );

    this.modCallbackService.addPriorityCallback(
      ModCallback.GET_SHADER_PARAMS,
      CallbackPriority.IMPORTANT,
      this.onGetShaderParamsCallback,
    );
  }

  private onPostRender(): void {
    // Based on https://github.com/Sectimus/isaac-planetarium-chance/blob/2360aede25d239a35a927bbf55c27af2a473149d/main.lua#L11
    if (this.getMemoizedShaderColorFixUsage() && (!this.game.IsPaused() || !Isaac.GetPlayer(0).ControlsEnabled)) {
      return;
    }

    if (this.shouldRender()) {
      this.render();
    }
  }

  private onGetShaderParams(shaderName: string): undefined {
    if (!this.getMemoizedShaderColorFixUsage()) {
      return;
    }

    if (shaderName !== RenderService.SHADER_NAME) {
      return;
    }

    // Based on https://github.com/Sectimus/isaac-planetarium-chance/blob/2360aede25d239a35a927bbf55c27af2a473149d/main.lua#L11
    if (this.game.IsPaused() && Isaac.GetPlayer(0).ControlsEnabled) {
      return;
    }

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

  private getMemoizedShaderColorFixUsage(): boolean {
    if (this.usesShaderColorFix === undefined) {
      throw new Error("Could not determine whether to use the shader color fix; RenderService was not initialized.");
    }

    return this.usesShaderColorFix;
  }
}
