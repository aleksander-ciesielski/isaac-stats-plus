import type { EncodedSettingValue } from "~/types/extension/EncodedSettingValue";
import { ProviderColor } from "~/entities/config/appearance/ProviderColor";

export class ProviderSettings {
  public static empty(): ProviderSettings {
    return new ProviderSettings({}, ProviderColor.None);
  }

  public constructor(
    private customSettings: Record<keyof never, EncodedSettingValue>,
    private color: ProviderColor,
  ) {}

  public getAllCustomSettings(): Record<keyof never, EncodedSettingValue> {
    return { ...this.customSettings };
  }

  public getCustomSettingRawValue(key: keyof never): EncodedSettingValue | undefined {
    return this.customSettings[key];
  }

  public setCustomSettingRawValue(key: keyof never, value: EncodedSettingValue): void {
    this.customSettings[key] = value;
  }

  public getColor(): ProviderColor {
    return this.color;
  }

  public setColor(color: ProviderColor): void {
    this.color = color;
  }
}
