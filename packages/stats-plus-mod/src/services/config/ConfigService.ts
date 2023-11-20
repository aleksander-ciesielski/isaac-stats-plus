import type { Config } from "~/entities/config/Config";
import { ConfigRepository } from "~/repositories/config/ConfigRepository";
import { LifecycleService } from "~/services/LifecycleService";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { Logger } from "~/Logger";
import { ErrorWithContext } from "~/errors/ErrorWithContext";

@Singleton()
export class ConfigService {
  private readonly logger = Logger.for(ConfigService.name);

  public constructor(
    @Inject(ConfigRepository) private readonly configRepository: ConfigRepository,
    @Inject(LifecycleService) private readonly lifecycleService: LifecycleService,
  ) {}

  public getConfig(): Config {
    return this.configRepository.get();
  }

  public updateConfigAndReload(update: (config: Config) => void): void {
    this.updateConfig(update);

    this.logger.info("Requesting a full reload due to the config changes...");
    this.lifecycleService.reloadAll();
  }

  public updateConfig(update: (config: Config) => void): void {
    try {
      const config = this.getConfig().clone();
      update(config);

      this.configRepository.save(config);
    } catch (e) {
      throw new ErrorWithContext("Error during config update and save.", {}, e as Error);
    }
  }

  public reload(): void {
    this.logger.debug("Reloading the ConfigService...");
    this.configRepository.reload();
    this.logger.debug("ConfigService reloaded.");
  }
}
