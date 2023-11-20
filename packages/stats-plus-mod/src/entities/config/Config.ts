import type { AppearanceConfig } from "~/entities/config/appearance/AppearanceConfig";
import type { LoadoutConfig } from "~/entities/config/loadout/LoadoutConfig";
import type { ProviderSettingsConfig } from "~/entities/config/providerSettings/ProviderSettingsConfig";
import type { ProviderStateConfig } from "~/entities/config/providerState/ProviderStateConfig";
import type { ConfigDTO } from "~/types/config/dto/ConfigDTO";
import {
  D8_MULTIPLIER_PROVIDER_ID,
  DAMAGE_MULTIPLIER_PROVIDER_ID,
  ESSENTIALS_ADDON_ID, MAP_BUTTON_HELD_CONDITION_ID,
} from "@isaac-stats-plus/essentials-addon";
import { BracketStyle } from "~/entities/config/appearance/BracketStyle";
import { ConditionType } from "~/entities/extension/condition/ConditionType";
import { speed } from "~/core/stats/speed";
import { tears } from "~/core/stats/tears";
import { damage } from "~/core/stats/damage";
import { range } from "~/core/stats/range";
import { shotSpeed } from "~/core/stats/shotSpeed";
import { luck } from "~/core/stats/luck";
import { ALWAYS_CONDITION_ID, CORE_ADDON_ID, NULL_PROVIDER_ID } from "~/core/coreAddonConstants";

export class Config {
  public static readonly LATEST_CONFIG_VERSION = "2.0.0" as const;

  public static readonly DEFAULT_CONFIG: ConfigDTO = {
    configVersion: Config.LATEST_CONFIG_VERSION,
    appearance: {
      textOpacity: 0.4,
      bracketStyle: BracketStyle.Curly,
      spacing: 5,
      showProviderChanges: true,
      useShaderColorFix: true,
    },
    loadout: [
      {
        stat: speed.getExternalAPI(),
        primaryProvider: { addon: ESSENTIALS_ADDON_ID, id: D8_MULTIPLIER_PROVIDER_ID },
        secondaryProvider: { addon: CORE_ADDON_ID, id: NULL_PROVIDER_ID },
        condition: {
          type: ConditionType.Standalone,
          ref: {
            addon: ESSENTIALS_ADDON_ID,
            id: MAP_BUTTON_HELD_CONDITION_ID,
          },
        },
      },
      {
        stat: tears.getExternalAPI(),
        primaryProvider: { addon: ESSENTIALS_ADDON_ID, id: D8_MULTIPLIER_PROVIDER_ID },
        secondaryProvider: { addon: CORE_ADDON_ID, id: NULL_PROVIDER_ID },
        condition: {
          type: ConditionType.Standalone,
          ref: {
            addon: ESSENTIALS_ADDON_ID,
            id: MAP_BUTTON_HELD_CONDITION_ID,
          },
        },
      },
      {
        stat: damage.getExternalAPI(),
        primaryProvider: { addon: ESSENTIALS_ADDON_ID, id: D8_MULTIPLIER_PROVIDER_ID },
        secondaryProvider: { addon: ESSENTIALS_ADDON_ID, id: DAMAGE_MULTIPLIER_PROVIDER_ID },
        condition: {
          type: ConditionType.Standalone,
          ref: {
            addon: ESSENTIALS_ADDON_ID,
            id: MAP_BUTTON_HELD_CONDITION_ID,
          },
        },
      },
      {
        stat: range.getExternalAPI(),
        primaryProvider: { addon: ESSENTIALS_ADDON_ID, id: D8_MULTIPLIER_PROVIDER_ID },
        secondaryProvider: { addon: CORE_ADDON_ID, id: NULL_PROVIDER_ID },
        condition: {
          type: ConditionType.Standalone,
          ref: {
            addon: ESSENTIALS_ADDON_ID,
            id: MAP_BUTTON_HELD_CONDITION_ID,
          },
        },
      },
      {
        stat: shotSpeed.getExternalAPI(),
        primaryProvider: { addon: CORE_ADDON_ID, id: NULL_PROVIDER_ID },
        secondaryProvider: { addon: CORE_ADDON_ID, id: NULL_PROVIDER_ID },
        condition: {
          type: ConditionType.Standalone,
          ref: {
            addon: CORE_ADDON_ID,
            id: ALWAYS_CONDITION_ID,
          },
        },
      },
      {
        stat: luck.getExternalAPI(),
        primaryProvider: { addon: CORE_ADDON_ID, id: NULL_PROVIDER_ID },
        secondaryProvider: { addon: CORE_ADDON_ID, id: NULL_PROVIDER_ID },
        condition: {
          type: ConditionType.Standalone,
          ref: {
            addon: CORE_ADDON_ID,
            id: ALWAYS_CONDITION_ID,
          },
        },
      },
    ],
    providerSettings: {
      settings: [],
    },
    providerState: {
      state: [],
    },
  };

  public constructor(
    public readonly configVersion: string,
    public readonly appearance: AppearanceConfig,
    public readonly loadout: LoadoutConfig,
    public readonly providerSettings: ProviderSettingsConfig,
    public readonly providerState: ProviderStateConfig,
  ) {}

  public clone(): Config {
    return new Config(
      this.configVersion,
      this.appearance.clone(),
      this.loadout.clone(),
      this.providerSettings.clone(),
      this.providerState.clone(),
    );
  }
}
