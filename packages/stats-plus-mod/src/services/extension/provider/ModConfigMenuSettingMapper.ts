import type { MenuEntity } from "~/types/menu/MenuEntity";
import type { ModConfigMenuContext } from "~/types/menu/mcm/ModConfigMenuContext";
import type { ProviderSettingMapper } from "~/types/extension/provider/ProviderSettingMapper";
import type { ProviderExtension } from "~/entities/extension/provider/ProviderExtension";
import type { ProviderSettingDefinition } from "~/types/extension/provider/ProviderSettingDefinition";
import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { ConfigService } from "~/services/config/ConfigService";
import { Inject } from "~/app/ioc/decorators/Inject";
import { SettingEncoderService } from "~/services/extension/SettingEncoderService";
import { ModConfigMenuSelect } from "~/entities/menu/mcm/entities/ModConfigMenuSelect";
import { ModConfigMenuRange } from "~/entities/menu/mcm/entities/ModConfigMenuRange";
import { ModConfigMenuToggle } from "~/entities/menu/mcm/entities/ModConfigMenuToggle";
import { ProviderToggleSetting } from "~/entities/extension/provider/settings/ProviderToggleSetting";
import { ProviderRangeSetting } from "~/entities/extension/provider/settings/ProviderRangeSetting";
import { ProviderSelectSetting } from "~/entities/extension/provider/settings/ProviderSelectSetting";
import { ErrorWithContext } from "~/errors/ErrorWithContext";

@Singleton()
export class ModConfigMenuSettingMapper implements ProviderSettingMapper<ModConfigMenuContext> {
  public constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(SettingEncoderService) private readonly settingEncoderService: SettingEncoderService,
  ) {}

  public map(
    provider: ProviderExtension,
    setting: ProviderSettingDefinition<unknown>,
  ): MenuEntity<ModConfigMenuContext> {
    if (setting instanceof ProviderToggleSetting) return this.mapToggle(provider, setting);
    if (setting instanceof ProviderRangeSetting) return this.mapRange(provider, setting);
    if (setting instanceof ProviderSelectSetting) return this.mapSelect(provider, setting);

    throw new ErrorWithContext("Unknown MCM setting definition.", {
      setting,
      settingType: typeof setting,
    });
  }

  private mapToggle(
    provider: ProviderExtension,
    toggle: ProviderToggleSetting,
  ): ModConfigMenuToggle {
    return new ModConfigMenuToggle({
      name: toggle.getName(),
      description: [toggle.getDescription()],
      retrieve: () => this.configService.getConfig().providerSettings.getCustomSettingValue(
        this.settingEncoderService,
        provider,
        toggle,
      ),
      update: (customSettingValue) => {
        this.configService.updateConfigAndReload((config) => {
          config.providerSettings.setCustomSettingValue(
            this.settingEncoderService,
            provider,
            toggle,
            customSettingValue,
          );
        });
      },
    });
  }

  private mapRange(
    provider: ProviderExtension,
    range: ProviderRangeSetting,
  ): ModConfigMenuRange {
    return new ModConfigMenuRange({
      name: range.getName(),
      description: [range.getDescription()],
      min: range.getMinValue(),
      max: range.getMaxValue(),
      retrieve: () => this.configService.getConfig().providerSettings
        .getCustomSettingValue(this.settingEncoderService, provider, range),
      update: (customSettingValue) => {
        this.configService.updateConfigAndReload((config) => {
          config.providerSettings.setCustomSettingValue(
            this.settingEncoderService,
            provider,
            range,
            customSettingValue,
          );
        });
      },
    });
  }

  private mapSelect<TValue extends StatsPlusAPI.SelectSettingAllowedValue>(
    provider: ProviderExtension,
    select: ProviderSelectSetting<TValue>,
  ): ModConfigMenuSelect<TValue> {
    return new ModConfigMenuSelect({
      fallback: () => select.getOptions()[0]!,
      name: select.getName(),
      description: [select.getDescription()],
      options: select.getOptions(),
      retrieve: () => this.configService.getConfig().providerSettings.getCustomSettingValue(
        this.settingEncoderService,
        provider,
        select,
      ),
      update: (value) => {
        this.configService.updateConfigAndReload((config) => {
          config.providerSettings.setCustomSettingValue(
            this.settingEncoderService,
            provider,
            select,
            value,
          );
        });
      },
    });
  }
}
