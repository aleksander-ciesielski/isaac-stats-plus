import type { ConfigMigrationList } from "~/types/config/migration/ConfigMigrationList";
import type { ConfigMigration } from "~/types/config/migration/ConfigMigration";
import { LegacyConfigMigration } from "~/migrations/config/LegacyConfigMigration";
import { DisableShaderFixConfigMigration } from "~/migrations/config/DisableShaderFixConfigMigration";
import { Singleton } from "~/app/ioc/decorators/Singleton";

@Singleton()
export class ConfigMigrationFactory {
  public createMigrations(): ConfigMigration[] {
    return [
      new LegacyConfigMigration(),
      new DisableShaderFixConfigMigration(),
    ] as const satisfies Readonly<ConfigMigrationList> as unknown as ConfigMigration[];
  }
}
