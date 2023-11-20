import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { ProviderDefinition } from "~/entities/extension/provider/ProviderDefinition";
import { ConfigService } from "~/services/config/ConfigService";
import { SettingEncoderService } from "~/services/extension/SettingEncoderService";
import { Inject } from "~/app/ioc/decorators/Inject";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { ResolvedSettings } from "~/entities/extension/provider/handle/ResolvedSettings";

@Singleton()
export class SettingsResolver {
  public constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(SettingEncoderService) private readonly settingEncoderService: SettingEncoderService,
  ) {}

  public resolveSettings<TSettings extends StatsPlusAPI.SettingListDefinition>(
    provider: ProviderDefinition,
  ): ResolvedSettings<TSettings> {
    const resolvedCustomSettingEntries = provider.getSettings().getSettings().map((setting) => {
      const value = this.configService.getConfig().providerSettings.getCustomSettingValue(
        this.settingEncoderService,
        provider.getExtension(),
        setting,
      );

      return [setting.getKey(), value];
    });

    return new ResolvedSettings({
      color: this.configService.getConfig().providerSettings.getProviderColor(provider),
      custom: Object.fromEntries(resolvedCustomSettingEntries),
    });
  }
}
