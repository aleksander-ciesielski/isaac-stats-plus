export interface ConfigMigration<TMigratedConfigVersion extends string = string> {
  getMigrationName(): string;
  getMigratedConfigVersion(): TMigratedConfigVersion;
  shouldExecute(config: Record<keyof never, unknown> | undefined): boolean;
  execute(config: Record<keyof never, unknown> | undefined): Record<keyof never, unknown> | undefined;
}
