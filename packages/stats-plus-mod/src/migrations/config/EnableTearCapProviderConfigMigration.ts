import type { ConfigMigration } from "~/types/config/migration/ConfigMigration";
import type { LoadoutConfigDTO } from "~/types/config/dto/loadout/LoadoutConfigDTO";
import type { Unvalidated } from "~/types/validation/Unvalidated";
import type { StandaloneConditionExtensionDTO } from "~/types/config/dto/extension/StandaloneConditionExtensionDTO";
import {
  D8_MULTIPLIER_PROVIDER_ID,
  ESSENTIALS_ADDON_ID,
  MAP_BUTTON_HELD_CONDITION_ID, TEAR_CAP_PROVIDER_ID,
} from "@isaac-stats-plus/essentials-addon";
import { isVersionGreaterThan } from "~/util/isVersionGreaterThan";
import { tears } from "~/core/stats/tears";
import { CORE_ADDON_ID, NULL_PROVIDER_ID } from "~/core/coreAddonConstants";
import { ConditionType } from "~/entities/extension/condition/ConditionType";

// eslint-disable-next-line max-len
export class EnableTearCapProviderConfigMigration implements ConfigMigration<typeof EnableTearCapProviderConfigMigration.MIGRATED_CONFIG_VERSION> {
  private static readonly MIGRATED_CONFIG_VERSION = "2.1.1" as const;

  public getMigrationName(): string {
    return EnableTearCapProviderConfigMigration.name;
  }

  public getMigratedConfigVersion(): typeof EnableTearCapProviderConfigMigration.MIGRATED_CONFIG_VERSION {
    return EnableTearCapProviderConfigMigration.MIGRATED_CONFIG_VERSION;
  }

  public shouldExecute(config: Record<keyof never, unknown> | undefined): boolean {
    if (typeof config?.configVersion !== "string") {
      return false;
    }

    if (!Array.isArray(config?.loadout)) {
      return false;
    }

    // eslint-disable-next-line max-len
    return isVersionGreaterThan(EnableTearCapProviderConfigMigration.MIGRATED_CONFIG_VERSION, config.configVersion);
  }

  public execute(config: Record<keyof never, unknown> | undefined): Record<keyof never, unknown> {
    return {
      ...config,
      configVersion: EnableTearCapProviderConfigMigration.MIGRATED_CONFIG_VERSION,
      loadout: (config!.loadout as Unvalidated<LoadoutConfigDTO>)!.map((item) => {
        if (
          item === undefined
          || typeof item !== "object"
          || item === null
          || item.stat?.addon !== tears.getExternalAPI().addon
          || item.stat?.id !== tears.getExternalAPI().id
          || item.primaryProvider?.addon !== ESSENTIALS_ADDON_ID
          || item.primaryProvider?.id !== D8_MULTIPLIER_PROVIDER_ID
          || item.secondaryProvider?.addon !== CORE_ADDON_ID
          || item.secondaryProvider?.id !== NULL_PROVIDER_ID
          || item.condition?.type !== ConditionType.Standalone
          || (item.condition as Unvalidated<StandaloneConditionExtensionDTO>)?.ref?.addon !== ESSENTIALS_ADDON_ID
          || (item.condition as Unvalidated<StandaloneConditionExtensionDTO>)?.ref?.id !== MAP_BUTTON_HELD_CONDITION_ID
        ) {
          return item;
        }

        return {
          stat: tears.getExternalAPI(),
          primaryProvider: { addon: ESSENTIALS_ADDON_ID, id: D8_MULTIPLIER_PROVIDER_ID },
          secondaryProvider: { addon: ESSENTIALS_ADDON_ID, id: TEAR_CAP_PROVIDER_ID },
          condition: {
            type: ConditionType.Standalone,
            ref: {
              addon: ESSENTIALS_ADDON_ID,
              id: MAP_BUTTON_HELD_CONDITION_ID,
            },
          },
        };
      }),
    };
  }
}
