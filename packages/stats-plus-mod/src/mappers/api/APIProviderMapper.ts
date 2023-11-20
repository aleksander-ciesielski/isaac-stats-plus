import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { ProviderDefinition } from "~/entities/extension/provider/ProviderDefinition";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { ProviderExtension } from "~/entities/extension/provider/ProviderExtension";
import { HashSet } from "~/structures/HashSet";
import { StatExtension } from "~/entities/extension/stat/StatExtension";
import { ProviderConditionsDefinition } from "~/entities/extension/provider/ProviderConditionsDefinition";
import { ProviderSettingsDefinition } from "~/entities/extension/provider/ProviderSettingsDefinition";
import { ProviderStateDefinition } from "~/entities/extension/provider/ProviderStateDefinition";
import { ProviderDisplaySettingsDefinition } from "~/entities/extension/provider/ProviderDisplaySettingsDefinition";
import { ProviderComputablesDefinition } from "~/entities/extension/provider/ProviderComputablesDefinition";
import { ProviderColor } from "~/entities/config/appearance/ProviderColor";
import { Inject } from "~/app/ioc/decorators/Inject";
import { ModCallbackService } from "~/services/menu/ModCallbackService";

@Singleton()
export class APIProviderMapper {
  public constructor(
    @Inject(ModCallbackService) private readonly modCallbackService: ModCallbackService,
  ) {}

  public mapAPIProvider<
    TDisplayValue = unknown,
    TComputables extends StatsPlusAPI.ComputableListDefinition = StatsPlusAPI.ComputableListDefinition,
    TConditions extends StatsPlusAPI.CompanionConditionListDefinition = StatsPlusAPI.CompanionConditionListDefinition,
    TSettings extends StatsPlusAPI.SettingListDefinition = StatsPlusAPI.SettingListDefinition,
    TState extends StatsPlusAPI.StateListDefinition = StatsPlusAPI.StateListDefinition,
  >(
    addonId: string,
    apiProvider: StatsPlusAPI.Provider<TDisplayValue, TComputables, TConditions, TSettings, TState>,
  ): ProviderDefinition<TDisplayValue, TComputables, TConditions, TSettings, TState> {
    const providerExtension = new ProviderExtension({
      addon: addonId,
      id: apiProvider.id,
    });

    return new ProviderDefinition({
      name: apiProvider.name,
      description: apiProvider.description,
      extension: providerExtension,
      targets: new HashSet(apiProvider.targets?.map((ref) => new StatExtension(ref))),
      preferredColor: this.mapAPIProviderColor(apiProvider.color),
      conditions: new ProviderConditionsDefinition(
        providerExtension,
        apiProvider.conditions ?? {} as TConditions,
        this.modCallbackService,
      ),
      settings: new ProviderSettingsDefinition(apiProvider.settings ?? {} as TSettings),
      state: new ProviderStateDefinition(apiProvider.state ?? {} as TState),
      display: new ProviderDisplaySettingsDefinition(apiProvider.display),
      computables: new ProviderComputablesDefinition(apiProvider.computables ?? {} as TComputables),
      mount(ctx) {
        return apiProvider.mount(ctx.getExternalAPI());
      },
    });
  }

  private mapAPIProviderColor(apiProviderColor: StatsPlusAPI.ProviderColor | undefined): ProviderColor {
    if (apiProviderColor === "GREY") return ProviderColor.Grey;
    if (apiProviderColor === "RED") return ProviderColor.Red;
    if (apiProviderColor === "GREEN") return ProviderColor.Green;
    if (apiProviderColor === "BLUE") return ProviderColor.Blue;
    if (apiProviderColor === "ORANGE") return ProviderColor.Orange;
    if (apiProviderColor === "MAGENTA") return ProviderColor.Magenta;
    if (apiProviderColor === "CYAN") return ProviderColor.Cyan;

    return ProviderColor.None;
  }
}
