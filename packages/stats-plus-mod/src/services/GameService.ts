import { ModCallback } from "isaac-typescript-definitions";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { ModCallbackService } from "~/services/menu/ModCallbackService";
import { InjectionToken } from "~/app/ioc/InjectionToken";

@Singleton()
export class GameService {
  private readonly onPostGameStartedListener = this.onPostGameStarted.bind(this);

  private achievementsEnabled = false;

  public constructor(
    @Inject(ModCallbackService) private readonly modCallbackService: ModCallbackService,
    @Inject(InjectionToken.IsaacAPI) private readonly isaac: typeof Isaac,
  ) {}

  public areAchievementsEnabled(): boolean {
    return this.achievementsEnabled;
  }

  public reload(): void {
    this.modCallbackService.removeCallback(ModCallback.POST_GAME_STARTED, this.onPostGameStartedListener);
    this.modCallbackService.addCallback(ModCallback.POST_GAME_STARTED, this.onPostGameStartedListener);
  }

  // Source: https://github.com/Sectimus/isaac-planetarium-chance/blob/b703c0e0bf28f3d3f6252b829e7ec6adb6d1d7d2/main.lua#L308
  private onPostGameStarted(): void {
    const machine = this.isaac.Spawn(6, 11, 0, Vector(0, 0), Vector(0, 0), undefined);
    const achievementsEnabled = machine.Exists();
    machine.Remove();

    this.achievementsEnabled = achievementsEnabled;
  }
}
