import type { ConfigMigration } from "~/types/config/migration/ConfigMigration";
import { isVersionGreaterThan } from "~/util/isVersionGreaterThan";

// eslint-disable-next-line max-len
export class DeleteShaderFixConfigMigration implements ConfigMigration<typeof DeleteShaderFixConfigMigration.MIGRATED_CONFIG_VERSION> {
  private static readonly MIGRATED_CONFIG_VERSION = "2.1.0" as const;

  public getMigrationName(): string {
    return DeleteShaderFixConfigMigration.name;
  }

  public getMigratedConfigVersion(): typeof DeleteShaderFixConfigMigration.MIGRATED_CONFIG_VERSION {
    return DeleteShaderFixConfigMigration.MIGRATED_CONFIG_VERSION;
  }

  public shouldExecute(config: Record<keyof never, unknown> | undefined): boolean {
    if (typeof config?.configVersion !== "string") {
      return false;
    }

    // eslint-disable-next-line max-len
    return isVersionGreaterThan(DeleteShaderFixConfigMigration.MIGRATED_CONFIG_VERSION, config.configVersion);
  }

  public execute(config: Record<keyof never, unknown> | undefined): Record<keyof never, unknown> {
    return {
      ...config,
      configVersion: DeleteShaderFixConfigMigration.MIGRATED_CONFIG_VERSION,
      appearance: {
        ...config?.appearance ?? {},
        useShaderColorFix: undefined,
      },
    };
  }
}
