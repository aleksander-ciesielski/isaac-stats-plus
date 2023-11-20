import type { ConfigDTO } from "~/types/config/dto/ConfigDTO";
import type { Unvalidated } from "~/types/validation/Unvalidated";
import { AppearanceConfigDTOValidator } from "~/validators/dto/config/AppearanceConfigDTOValidator";
import { LoadoutConfigDTOValidator } from "~/validators/dto/config/LoadoutConfigDTOValidator";
import { ProviderSettingsConfigDTOValidator } from "~/validators/dto/config/ProviderSettingsConfigDTOValidator";
import { ProviderStateConfigDTOValidator } from "~/validators/dto/config/ProviderStateConfigDTOValidator";
import { Config } from "~/entities/config/Config";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { Logger } from "~/Logger";

@Singleton()
export class ConfigDTOValidator {
  private readonly logger = Logger.for(ConfigDTOValidator.name);

  public constructor(
    @Inject(AppearanceConfigDTOValidator) private readonly appearanceConfigDTOValidator: AppearanceConfigDTOValidator,
    @Inject(LoadoutConfigDTOValidator) private readonly loadoutConfigDTOValidator: LoadoutConfigDTOValidator,
    @Inject(ProviderSettingsConfigDTOValidator) private readonly providerSettingsConfigDTOValidator: ProviderSettingsConfigDTOValidator,
    @Inject(ProviderStateConfigDTOValidator) private readonly stateConfigDTOValidator: ProviderStateConfigDTOValidator,
  ) {}

  public getValidConfigDTO(baseConfigDTO: Unvalidated<ConfigDTO>): ConfigDTO {
    if (baseConfigDTO === undefined) {
      return Config.DEFAULT_CONFIG;
    }

    if (baseConfigDTO.configVersion !== Config.LATEST_CONFIG_VERSION) {
      this.logger.warn(
        "Expected config version to equal the latest one, overriding given config with the default one.",
        {
          configVersion: baseConfigDTO.configVersion,
          type: typeof baseConfigDTO.configVersion,
          latestConfigVersion: Config.LATEST_CONFIG_VERSION,
        },
      );

      return Config.DEFAULT_CONFIG;
    }

    return {
      configVersion: baseConfigDTO.configVersion,
      appearance: this.appearanceConfigDTOValidator.validate(baseConfigDTO.appearance),
      loadout: this.loadoutConfigDTOValidator.validate(baseConfigDTO.loadout),
      providerSettings: this.providerSettingsConfigDTOValidator.validate(baseConfigDTO.providerSettings),
      providerState: this.stateConfigDTOValidator.validate(baseConfigDTO.providerState),
    };
  }
}
