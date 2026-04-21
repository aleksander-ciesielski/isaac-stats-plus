import type { ConfigMigration } from "~/types/config/migration/ConfigMigration";
import { isVersionGreaterThan } from "~/util/isVersionGreaterThan";
import { LogLevel } from "~/Logger";

// eslint-disable-next-line max-len
export class AddLogLevelConfigMigration implements ConfigMigration<typeof AddLogLevelConfigMigration.MIGRATED_CONFIG_VERSION> {
  private static readonly MIGRATED_CONFIG_VERSION = "2.1.2" as const;

  public getMigrationName(): string {
    return AddLogLevelConfigMigration.name;
  }

  public getMigratedConfigVersion(): typeof AddLogLevelConfigMigration.MIGRATED_CONFIG_VERSION {
    return AddLogLevelConfigMigration.MIGRATED_CONFIG_VERSION;
  }

  public shouldExecute(config: Record<keyof never, unknown> | undefined): boolean {
    if (typeof config?.configVersion !== "string") {
      return false;
    }

    // eslint-disable-next-line max-len
    return isVersionGreaterThan(AddLogLevelConfigMigration.MIGRATED_CONFIG_VERSION, config.configVersion);
  }

  public execute(config: Record<keyof never, unknown> | undefined): Record<keyof never, unknown> {
    return {
      ...config,
      configVersion: AddLogLevelConfigMigration.MIGRATED_CONFIG_VERSION,
      logLevel: LogLevel.Info,
    };
  }
}
