import type { ConfigMigration } from "~/types/config/migration/ConfigMigration";
import { DAMAGE_MULTIPLIER_PROVIDER_ID, ESSENTIALS_ADDON_ID } from "@isaac-stats-plus/essentials-addon";
import { BracketStyle } from "~/entities/config/appearance/BracketStyle";
import { Config } from "~/entities/config/Config";
import { Logger } from "~/Logger";
import { ProviderColor } from "~/entities/config/appearance/ProviderColor";

export class LegacyConfigMigration implements ConfigMigration<typeof LegacyConfigMigration.MIGRATED_CONFIG_VERSION> {
  private static readonly MIGRATED_CONFIG_VERSION = "2.0.0" as const;

  private readonly logger = Logger.for(LegacyConfigMigration.name);

  public getMigrationName(): string {
    return LegacyConfigMigration.name;
  }

  public getMigratedConfigVersion(): typeof LegacyConfigMigration.MIGRATED_CONFIG_VERSION {
    return LegacyConfigMigration.MIGRATED_CONFIG_VERSION;
  }

  public shouldExecute(config: Record<keyof never, unknown> | undefined): boolean {
    return (config?.configVersion === undefined);
  }

  public execute(config: Record<keyof never, unknown> | undefined): Record<keyof never, unknown> {
    return {
      configVersion: LegacyConfigMigration.MIGRATED_CONFIG_VERSION,
      appearance: {
        textOpacity: this.migrateTextOpacity(config?.opacity),
        bracketStyle: this.migrateBracketStyle(config?.brackets),
        spacing: Config.DEFAULT_CONFIG.appearance.spacing,
      },
      loadout: Config.DEFAULT_CONFIG.loadout,
      providerSettings: {
        settings: [
          {
            ref: {
              addon: ESSENTIALS_ADDON_ID,
              id: DAMAGE_MULTIPLIER_PROVIDER_ID,
            },
            settings: {
              custom: {
                trackD8: true,
              },
              color: ProviderColor.None,
            },
          },
        ],
      },
    };
  }

  private migrateTextOpacity(legacyTextOpacity: unknown): number {
    if (typeof legacyTextOpacity !== "number") {
      this.logger.warn(
        "Expected legacy text opacity to be a number.",
        { legacyTextOpacity, type: typeof legacyTextOpacity },
      );

      return Config.DEFAULT_CONFIG.appearance.textOpacity;
    }

    if (0 > legacyTextOpacity || legacyTextOpacity > 100) {
      const defaultValue = Config.DEFAULT_CONFIG.appearance.textOpacity;

      this.logger.warn(
        "Expected legacy text to be between 0 and 100, overriding with the default value.",
        { legacyTextOpacity, defaultValue },
      );

      return defaultValue;
    }

    return legacyTextOpacity / 100;
  }

  private migrateBracketStyle(legacyBracketStyle: unknown): BracketStyle {
    if (legacyBracketStyle === "Round") return BracketStyle.Round;
    if (legacyBracketStyle === "Square") return BracketStyle.Square;
    if (legacyBracketStyle === "None") return BracketStyle.None;

    const defaultValue = Config.DEFAULT_CONFIG.appearance.bracketStyle;

    this.logger.warn(
      "Expected legacy bracket style to be either 'Round', 'Square' or 'None', overriding with the default value.",
      { legacyBracketStyle, defaultValue },
    );

    return defaultValue;
  }
}
