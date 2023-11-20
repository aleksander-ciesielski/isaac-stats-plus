import type { Unvalidated } from "~/types/validation/Unvalidated";
import type { ProviderSettingsConfigDTO } from "~/types/config/dto/providerSettings/ProviderSettingsConfigDTO";
import type { ProviderSettingsDTO } from "~/types/config/dto/providerSettings/ProviderSettingsDTO";
import type { ProviderSettingsConfigEntryDTO } from "~/types/config/dto/providerSettings/ProviderSettingsConfigEntryDTO";
import { ProviderColor } from "~/entities/config/appearance/ProviderColor";
import { isExtensionRef } from "~/util/validation/isExtensionRef";
import { Config } from "~/entities/config/Config";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Logger } from "~/Logger";
import { ProviderStateConfigDTOValidator } from "~/validators/dto/config/ProviderStateConfigDTOValidator";

@Singleton()
export class ProviderSettingsConfigDTOValidator {
  private readonly logger = Logger.for(ProviderStateConfigDTOValidator.name);

  public validate(
    providerSettings: Unvalidated<ProviderSettingsConfigDTO>,
  ): ProviderSettingsConfigDTO {
    return {
      settings: this.validateSettings(providerSettings?.settings),
    };
  }

  private validateSettings(
    settings: Unvalidated<ProviderSettingsConfigEntryDTO[]>,
  ): ProviderSettingsConfigEntryDTO[] {
    if (!Array.isArray(settings)) {
      this.logger.warn(
        "Expected provider settings entry to be an array.",
        { settings, type: typeof settings },
      );

      return Config.DEFAULT_CONFIG.providerSettings.settings;
    }

    return settings
      .map((entry) => this.validateOptionsEntry(entry))
      .filter((entry) => entry !== undefined) as ProviderSettingsConfigEntryDTO[];
  }

  private validateOptionsEntry(
    entry: Unvalidated<ProviderSettingsConfigEntryDTO>,
  ): ProviderSettingsConfigEntryDTO | undefined {
    if (entry === undefined) {
      this.logger.warn("Provider settings entry is undefined.");
      return;
    }

    if (!isExtensionRef(entry.ref)) {
      this.logger.warn(
        "Expected ref of the provider settings to be a valid extension ref object.",
        { ref: entry.ref, type: typeof entry.ref },
      );

      return;
    }

    return {
      ref: entry.ref,
      settings: this.validateSettingsField(entry.settings),
    };
  }

  private validateSettingsField(
    settings: Unvalidated<ProviderSettingsDTO>,
  ): ProviderSettingsDTO {
    return {
      color: this.validateProviderColorSetting(settings?.color as ProviderColor),
      custom: this.validateCustomSettings(settings?.custom),
    };
  }

  private validateProviderColorSetting(
    color: Unvalidated<ProviderColor>,
  ): ProviderColor {
    if (color === undefined || !Object.values(ProviderColor).includes(color)) {
      this.logger.warn(
        "Invalid value of provider color.",
        { color, type: typeof color },
      );

      return ProviderColor.None;
    }

    return color;
  }

  private validateCustomSettings(
    customSettings: Unvalidated<Record<keyof never, string>>,
  ): Record<keyof never, string> {
    if (typeof customSettings !== "object") {
      this.logger.warn(
        "Expected custom provider settings to an object.",
        { customSettings, type: typeof customSettings },
      );

      return {};
    }

    return customSettings as Record<keyof never, string>;
  }
}
