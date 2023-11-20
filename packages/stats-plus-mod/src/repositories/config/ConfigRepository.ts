import type { ConfigDTO } from "~/types/config/dto/ConfigDTO";
import type { Unvalidated } from "~/types/validation/Unvalidated";
import type { JsonSerializer } from "~/types/JsonSerializer";
import { ConfigDTOValidator } from "~/validators/dto/config/ConfigDTOValidator";
import { ConfigMigrator } from "~/services/config/migration/ConfigMigrator";
import { ConfigMapper } from "~/mappers/config/ConfigMapper";
import { Config } from "~/entities/config/Config";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { Logger } from "~/Logger";
import { InjectionToken } from "~/app/ioc/InjectionToken";

@Singleton()
export class ConfigRepository {
  private readonly logger = Logger.for(ConfigRepository.name);

  private config: Config | undefined;

  public constructor(
    @Inject(InjectionToken.ModAPI) private readonly mod: Mod,
    @Inject(InjectionToken.JsonSerializer) private readonly jsonSerializer: JsonSerializer,
    @Inject(ConfigDTOValidator) private readonly configDTOValidator: ConfigDTOValidator,
    @Inject(ConfigMigrator) private readonly configMigrator: ConfigMigrator,
    @Inject(ConfigMapper) private readonly configMapper: ConfigMapper,
  ) {}

  public get(): Config {
    if (this.config === undefined) {
      throw new Error("ConfigRepository has not been initialized.");
    }

    return this.config;
  }

  public reload(): void {
    this.config = this.load();
    this.save(this.config);
  }

  public save(config: Config): void {
    try {
      const configDTO = this.configMapper.toDTO(config);
      const jsonEncoded = this.jsonSerializer.encode(configDTO);

      this.config = config.clone();
      this.mod.SaveData(jsonEncoded);
      this.logger.debug("Successfully saved the given config.");
    } catch (e) {
      this.logger.error("Failed to save the given config.", e);
      throw e;
    }
  }

  private load(): Config {
    if (!this.mod.HasData()) {
      this.logger.info("No data stored, returning default config.");
      return this.configMapper.toConfig(Config.DEFAULT_CONFIG);
    }

    try {
      const rawDTO = this.jsonSerializer.decode<Unvalidated<ConfigDTO>>(this.mod.LoadData());
      const migratedDTO = this.configMigrator.getConfigWithMigrationsPerformed(rawDTO);
      const configDTO = this.configDTOValidator.getValidConfigDTO(migratedDTO);
      const config = this.configMapper.toConfig(configDTO);

      this.logger.info("Successfully loaded stored config.");
      return config;
    } catch (e) {
      this.logger.error("Failed to load stored config, returning default config instead.", e);
      return this.configMapper.toConfig(Config.DEFAULT_CONFIG);
    }
  }
}
