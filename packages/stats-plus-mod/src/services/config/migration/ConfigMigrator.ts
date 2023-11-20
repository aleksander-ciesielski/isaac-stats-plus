import type { ConfigDTO } from "~/types/config/dto/ConfigDTO";
import type { Unvalidated } from "~/types/validation/Unvalidated";
import { Logger } from "~/Logger";
import { ConfigMigrationFactory } from "~/services/config/migration/ConfigMigrationFactory";
import { Config } from "~/entities/config/Config";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";

@Singleton()
export class ConfigMigrator {
  private readonly logger = Logger.for(ConfigMigrator.name);

  public constructor(
    @Inject(ConfigMigrationFactory) private readonly configMigrationFactory: ConfigMigrationFactory,
  ) {}

  public getConfigWithMigrationsPerformed(config: Unvalidated<ConfigDTO>): Unvalidated<ConfigDTO> {
    if (config === undefined) {
      return Config.DEFAULT_CONFIG;
    }

    const migrationsToExecute = this.configMigrationFactory.createMigrations()
      .filter((migration) => migration.shouldExecute(config));

    try {
      return migrationsToExecute
        .reduce<Unvalidated<ConfigDTO>>((currentConfig, migration) => {
          const migrationName = migration.getMigrationName();
          const migratedConfigVersion = migration.getMigratedConfigVersion();
          const currentConfigVersion = (typeof currentConfig?.configVersion === "string")
            ? currentConfig.configVersion
            : "?";

          this.logger.info(
            `Executing config migration "${migrationName}" (${currentConfigVersion} -> ${migratedConfigVersion})...`,
          );

          const migratedConfig = migration.execute(currentConfig) as Unvalidated<ConfigDTO>;
          this.logger.info(`Migration "${migrationName}" finished successfully.`);

          return migratedConfig;
        }, config);
    } catch (e: any) {
      this.logger.warn("Config migration failed, overriding config with the default one.", e);
      return Config.DEFAULT_CONFIG;
    }
  }
}
