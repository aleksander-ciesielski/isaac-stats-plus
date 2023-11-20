import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { ProviderColor } from "~/entities/config/appearance/ProviderColor";

export interface ResolvedSettingsOptions<TSettings extends StatsPlusAPI.SettingListDefinition> {
  color: ProviderColor;
  custom: {
    [K in keyof TSettings]: StatsPlusAPI.ResolvedSetting<TSettings[K]>;
  };
}

export class ResolvedSettings<TSettings extends StatsPlusAPI.SettingListDefinition> {
  public constructor(
    private readonly options: ResolvedSettingsOptions<TSettings>,
  ) {}

  public getProviderColor(): ProviderColor {
    return this.options.color;
  }

  public getExternalAPI(): StatsPlusAPI.ResolvedSettings<TSettings> {
    return {
      ...this.options,
      color: this.getAPIProviderColor(this.getProviderColor()),
    };
  }

  private getAPIProviderColor(color: ProviderColor): StatsPlusAPI.ProviderColor {
    if (color === ProviderColor.Grey) return "GREY";
    if (color === ProviderColor.Red) return "RED";
    if (color === ProviderColor.Green) return "GREEN";
    if (color === ProviderColor.Blue) return "BLUE";
    if (color === ProviderColor.Orange) return "ORANGE";
    if (color === ProviderColor.Magenta) return "MAGENTA";
    if (color === ProviderColor.Cyan) return "CYAN";

    return "NONE";
  }
}
