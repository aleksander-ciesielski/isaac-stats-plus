import type { ConfigMigration } from "~/types/config/migration/ConfigMigration";
import { isVersionGreaterThan } from "~/util/isVersionGreaterThan";

// https://github.com/aleksander-ciesielski/isaac-stats-plus/issues/4
// eslint-disable-next-line max-len
export class DisableShaderFixConfigMigration implements ConfigMigration<typeof DisableShaderFixConfigMigration.MIGRATED_CONFIG_VERSION> {
  private static readonly MIGRATED_CONFIG_VERSION = "2.0.5" as const;

  public getMigrationName(): string {
    return DisableShaderFixConfigMigration.name;
  }

  public getMigratedConfigVersion(): typeof DisableShaderFixConfigMigration.MIGRATED_CONFIG_VERSION {
    return DisableShaderFixConfigMigration.MIGRATED_CONFIG_VERSION;
  }

  public shouldExecute(config: Record<keyof never, unknown> | undefined): boolean {
    if (typeof config?.configVersion !== "string") {
      return false;
    }

    // eslint-disable-next-line max-len
    return isVersionGreaterThan(DisableShaderFixConfigMigration.MIGRATED_CONFIG_VERSION, config.configVersion);
  }

  public execute(config: Record<keyof never, unknown> | undefined): Record<keyof never, unknown> {
    return {
      ...config,
      configVersion: DisableShaderFixConfigMigration.MIGRATED_CONFIG_VERSION,
      appearance: {
        ...config?.appearance ?? {},
        useShaderColorFix: false,
      },
    };
  }
}
