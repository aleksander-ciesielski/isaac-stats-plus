import type { SettingEncoderService } from "~/services/extension/SettingEncoderService";
import type { ProviderExtension } from "~/entities/extension/provider/ProviderExtension";
import type { HashMap } from "~/structures/HashMap";
import type { ProviderDefinition } from "~/entities/extension/provider/ProviderDefinition";
import type { ProviderSettingDefinition } from "~/types/extension/provider/ProviderSettingDefinition";
import type { ProviderColor } from "~/entities/config/appearance/ProviderColor";
import { ProviderSettings } from "~/entities/config/providerSettings/ProviderSettings";

export interface ProviderSettingsConfigOptions {
  providerSettings: HashMap<ProviderExtension, ProviderSettings>;
}

export class ProviderSettingsConfig {
  private readonly providerSettings: HashMap<ProviderExtension, ProviderSettings>;

  public constructor(options: ProviderSettingsConfigOptions) {
    this.providerSettings = options.providerSettings;
  }

  public clone(): ProviderSettingsConfig {
    return new ProviderSettingsConfig({
      providerSettings: this.providerSettings.clone(),
    });
  }

  public getProviderSettingsMap(): HashMap<ProviderExtension, ProviderSettings> {
    return this.providerSettings.clone();
  }

  public getProviderColor(provider: ProviderDefinition): ProviderColor {
    return this.providerSettings.get(provider.getExtension())?.getColor() ?? provider.getPreferredColor();
  }

  public getCustomSettingValue<TValue>(
    settingEncoderService: SettingEncoderService,
    provider: ProviderExtension,
    setting: ProviderSettingDefinition<TValue>,
  ): TValue {
    const value = this.providerSettings.get(provider)?.getCustomSettingRawValue(setting.getKey());
    if (value === undefined) {
      return setting.getInitialValue();
    }

    return settingEncoderService.decodeSetting(setting, value);
  }

  public setProviderColor(provider: ProviderExtension, providerColor: ProviderColor): void {
    const field = this.providerSettings.get(provider) ?? ProviderSettings.empty();
    field.setColor(providerColor);

    this.providerSettings.set(provider, field);
  }

  public setCustomSettingValue<TValue>(
    settingEncoderService: SettingEncoderService,
    provider: ProviderExtension,
    setting: ProviderSettingDefinition<TValue>,
    value: TValue,
  ): void {
    const field = this.providerSettings.get(provider) ?? ProviderSettings.empty();
    field.setCustomSettingRawValue(setting.getKey(), settingEncoderService.encodeSetting(setting, value));

    this.providerSettings.set(provider, field);
  }
}
