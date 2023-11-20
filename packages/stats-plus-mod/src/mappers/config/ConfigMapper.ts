import type { ConfigDTO } from "~/types/config/dto/ConfigDTO";
import type { LoadoutConfigEntryDTO } from "~/types/config/dto/loadout/LoadoutConfigEntryDTO";
import type { ProviderExtensionDTO } from "~/types/config/dto/extension/ProviderExtensionDTO";
import type { ProviderSettingsDTO } from "~/types/config/dto/providerSettings/ProviderSettingsDTO";
import type { AnyConditionExtensionDTO } from "~/types/config/dto/extension/AnyConditionExtensionDTO";
import type { AnyConditionExtension } from "~/types/extension/condition/AnyConditionExtension";
import type { StatExtensionDTO } from "~/types/config/dto/extension/StatExtensionDTO";
import { LoadoutConfigEntry } from "~/entities/config/loadout/LoadoutConfigEntry";
import { ProviderSettings } from "~/entities/config/providerSettings/ProviderSettings";
import { Config } from "~/entities/config/Config";
import { AppearanceConfig } from "~/entities/config/appearance/AppearanceConfig";
import { LoadoutConfig } from "~/entities/config/loadout/LoadoutConfig";
import { ProviderSettingsConfig } from "~/entities/config/providerSettings/ProviderSettingsConfig";
import { ProviderStateConfig } from "~/entities/config/providerState/ProviderStateConfig";
import { ProviderExtension } from "~/entities/extension/provider/ProviderExtension";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { HashMap } from "~/structures/HashMap";
import { StandaloneConditionExtension } from "~/entities/extension/condition/standalone/StandaloneConditionExtension";
import { CompanionConditionExtension } from "~/entities/extension/condition/companion/CompanionConditionExtension";
import { ConditionType } from "~/entities/extension/condition/ConditionType";
import { StatExtension } from "~/entities/extension/stat/StatExtension";

@Singleton()
export class ConfigMapper {
  public toConfig(configDTO: ConfigDTO): Config {
    const loadout = new HashMap(configDTO.loadout.map((entry) => [entry.stat, entry]));

    return new Config(
      configDTO.configVersion,
      new AppearanceConfig({
        textOpacity: configDTO.appearance.textOpacity,
        bracketStyle: configDTO.appearance.bracketStyle,
        spacing: configDTO.appearance.spacing,
        showProviderChanges: configDTO.appearance.showProviderChanges,
        useShaderColorFix: configDTO.appearance.useShaderColorFix,
      }),
      new LoadoutConfig({
        entries: new HashMap(
          Array.from(loadout.entries()).map(([stat, loadoutConfigEntryDTO]) => [
            this.toStatExtension(stat),
            this.toLoadoutConfigEntry(loadoutConfigEntryDTO)]),
        ),
      }),
      new ProviderSettingsConfig({
        providerSettings: new HashMap(configDTO.providerSettings.settings.map(({ ref, settings }) => [
          new ProviderExtension(ref),
          this.toProviderSettings(settings),
        ])),
      }),
      new ProviderStateConfig({
        providerState: new HashMap(configDTO.providerState.state.map(({ ref, state }) => [
          new ProviderExtension(ref),
          state,
        ])),
      }),
    );
  }

  public toDTO(config: Config): ConfigDTO {
    return {
      configVersion: config.configVersion,
      appearance: {
        textOpacity: config.appearance.getTextOpacity(),
        bracketStyle: config.appearance.getBracketStyle(),
        spacing: config.appearance.getSpacing(),
        showProviderChanges: config.appearance.showsProviderChanges(),
        useShaderColorFix: config.appearance.usesShaderColorFix(),
      },
      loadout: config.loadout.getActiveStats()
        .map((stat) => config.loadout.getLoadoutEntry(stat))
        .filter((entryOrUndefined) => (entryOrUndefined !== undefined))
        .map((entry) => this.toLoadoutEntryDTO(entry)),
      providerSettings: {
        settings: Array.from(config.providerSettings.getProviderSettingsMap().entries())
          .map(([providerExtension, settings]) => ({
            ref: this.toProviderExtensionDTO(providerExtension),
            settings: this.toProviderSettingsDTO(settings),
          })),
      },
      providerState: {
        state: Array.from(config.providerState.getProviderStateMap().entries())
          .map(([providerExtension, state]) => ({
            ref: this.toProviderExtensionDTO(providerExtension),
            state,
          })),
      },
    };
  }

  public toConditionExtensionDTO(
    conditionExtension: AnyConditionExtension,
  ): AnyConditionExtensionDTO {
    if (conditionExtension instanceof StandaloneConditionExtension) {
      return {
        type: ConditionType.Standalone,
        ref: {
          addon: conditionExtension.addonId,
          id: conditionExtension.standaloneConditionId,
        },
      };
    }

    if (conditionExtension instanceof CompanionConditionExtension) {
      return {
        type: ConditionType.Companion,
        providerRef: this.toProviderExtensionDTO(conditionExtension.providerExtension),
        id: conditionExtension.id,
      };
    }

    // eslint-disable-next-line max-len
    throw new Error("Could not map a condition extension: it is neither an instance of StandaloneConditionExtension nor CompanionConditionExtension.");
  }

  public toProviderExtensionDTO(providerExtension: ProviderExtension): ProviderExtensionDTO {
    return {
      addon: providerExtension.addonId,
      id: providerExtension.providerId,
    };
  }

  private toProviderSettings(providerSettingsDTO: ProviderSettingsDTO): ProviderSettings {
    return new ProviderSettings(
      providerSettingsDTO.custom,
      providerSettingsDTO.color,
    );
  }

  private toProviderSettingsDTO(providerSettings: ProviderSettings): ProviderSettingsDTO {
    return {
      custom: providerSettings.getAllCustomSettings(),
      color: providerSettings.getColor(),
    };
  }

  private toLoadoutConfigEntry(loadoutConfigEntryDTO: LoadoutConfigEntryDTO): LoadoutConfigEntry {
    return new LoadoutConfigEntry({
      stat: this.toStatExtension(loadoutConfigEntryDTO.stat),
      primaryProvider: this.toProviderExtension(loadoutConfigEntryDTO.primaryProvider),
      secondaryProvider: this.toProviderExtension(loadoutConfigEntryDTO.secondaryProvider),
      condition: this.toConditionExtension(loadoutConfigEntryDTO.condition),
    });
  }

  private toLoadoutEntryDTO(loadoutConfigEntry: LoadoutConfigEntry): LoadoutConfigEntryDTO {
    return {
      stat: this.toStatExtensionDTO(loadoutConfigEntry.getStat()),
      primaryProvider: this.toProviderExtensionDTO(loadoutConfigEntry.getPrimaryProvider()),
      secondaryProvider: this.toProviderExtensionDTO(loadoutConfigEntry.getSecondaryProvider()),
      condition: this.toConditionExtensionDTO(loadoutConfigEntry.getCondition()),
    };
  }

  private toConditionExtension(
    conditionDTO: AnyConditionExtensionDTO,
  ): AnyConditionExtension {
    if (conditionDTO.type === ConditionType.Standalone) {
      return new StandaloneConditionExtension(conditionDTO.ref);
    }

    if (conditionDTO.type === ConditionType.Companion) {
      return new CompanionConditionExtension(new ProviderExtension(conditionDTO.providerRef), conditionDTO.id);
    }

    // eslint-disable-next-line max-len
    throw new Error("Could not map a condition extension DTO: its' type is neither ConditionType.Standalone nor ConditionType.Companion.");
  }

  private toProviderExtension(providerExtensionDTO: ProviderExtensionDTO): ProviderExtension {
    return new ProviderExtension(providerExtensionDTO);
  }

  private toStatExtension(statExtensionDTO: StatExtensionDTO): StatExtension {
    return new StatExtension(statExtensionDTO);
  }

  private toStatExtensionDTO(statExtension: StatExtension): StatExtensionDTO {
    return {
      addon: statExtension.addonId,
      id: statExtension.statId,
    };
  }
}
