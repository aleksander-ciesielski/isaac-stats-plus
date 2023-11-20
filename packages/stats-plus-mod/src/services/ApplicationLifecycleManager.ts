import { PlayerService } from "~/services/PlayerService";
import { MenuService } from "~/services/menu/MenuService";
import { StatService } from "~/services/stat/StatService";
import { RenderService } from "~/services/renderer/RenderService";
import { LifecycleService } from "~/services/LifecycleService";
import { ConfigService } from "~/services/config/ConfigService";
import { LoadoutService } from "~/services/LoadoutService";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { API } from "~/services/extension/API";
import { Logger } from "~/Logger";
import { ErrorWithContext } from "~/errors/ErrorWithContext";

@Singleton()
export class ApplicationLifecycleManager {
  private readonly logger = Logger.for(ApplicationLifecycleManager.name);

  public constructor(
    @Inject(LifecycleService) private readonly lifecycleService: LifecycleService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(MenuService) private readonly menuService: MenuService,
    @Inject(PlayerService) private readonly playerService: PlayerService,
    @Inject(LoadoutService) private readonly loadoutService: LoadoutService,
    @Inject(StatService) private readonly statService: StatService,
    @Inject(RenderService) private readonly renderService: RenderService,
    @Inject(API) private readonly api: API,
  ) {}

  public setup(): void {
    this.api.setup();
    this.lifecycleService.getEvents().subscribe("reload", () => this.reload());

    this.logger.info("Requesting an initial mod state reload.");
    this.reload();
    this.logger.info("Initial mod state reload finished.");
  }

  private reload(): void {
    this.logger.info("Reloading the state of the mod.");

    try {
      this.configService.reload();
      this.menuService.reload();
      this.playerService.reload();
      this.statService.reload();
      this.loadoutService.reload();
      this.renderService.reload();

      this.logger.info("Mod state reloaded successfully.");
    } catch (e) {
      throw new ErrorWithContext("Error during the mod state reload", {}, e as Error);
    }
  }
}
