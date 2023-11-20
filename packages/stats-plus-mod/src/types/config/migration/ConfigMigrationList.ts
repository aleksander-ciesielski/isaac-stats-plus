import type { Config } from "~/entities/config/Config";
import type { ConfigMigration } from "~/types/config/migration/ConfigMigration";

export type ConfigMigrationList = [
  ...ConfigMigration[],
  ConfigMigration<typeof Config.LATEST_CONFIG_VERSION>,
];
