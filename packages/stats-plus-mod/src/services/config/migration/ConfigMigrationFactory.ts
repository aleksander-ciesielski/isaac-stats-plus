import type { ConfigMigrationList } from "~/types/config/migration/ConfigMigrationList";
import type { ConfigMigration } from "~/types/config/migration/ConfigMigration";
import { LegacyConfigMigration } from "~/migrations/config/LegacyConfigMigration";
import { Singleton } from "~/app/ioc/decorators/Singleton";

@Singleton()
export class ConfigMigrationFactory {
  public createMigrations(): ConfigMigration[] {
    return [
      new LegacyConfigMigration(),
    ] as const satisfies Readonly<ConfigMigrationList> as unknown as ConfigMigration[];
  }
}
