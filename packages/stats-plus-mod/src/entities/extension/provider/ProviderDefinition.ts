import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { HashSet } from "~/structures/HashSet";
import type { StatExtension } from "~/entities/extension/stat/StatExtension";
import type { ProviderExtension } from "~/entities/extension/provider/ProviderExtension";
import type { ProviderStateDefinition } from "~/entities/extension/provider/ProviderStateDefinition";
import type { ProviderSettingsDefinition } from "~/entities/extension/provider/ProviderSettingsDefinition";
import type { ProviderConditionsDefinition } from "~/entities/extension/provider/ProviderConditionsDefinition";
import type { ProviderComputablesDefinition } from "~/entities/extension/provider/ProviderComputablesDefinition";
import type { ProviderDisplaySettingsDefinition } from "~/entities/extension/provider/ProviderDisplaySettingsDefinition";
import type { ProviderInstanceHandleContext } from "~/entities/player/provider/ProviderInstanceHandleContext";
import type { ProviderColor } from "~/entities/config/appearance/ProviderColor";
import { ProviderInstanceHandle } from "~/entities/extension/provider/handle/ProviderInstanceHandle";

export interface ProviderDefinitionConstructorOptions<
  TDisplayValue = unknown,
  TComputables extends StatsPlusAPI.ComputableListDefinition = StatsPlusAPI.ComputableListDefinition,
  TConditions extends StatsPlusAPI.CompanionConditionListDefinition = StatsPlusAPI.CompanionConditionListDefinition,
  TSettings extends StatsPlusAPI.SettingListDefinition = StatsPlusAPI.SettingListDefinition,
  TState extends StatsPlusAPI.StateListDefinition = StatsPlusAPI.StateListDefinition,
> {
  name: string;
  description: string;
  extension: ProviderExtension;
  targets: HashSet<StatExtension>;
  preferredColor: ProviderColor;
  conditions: ProviderConditionsDefinition<TConditions>;
  settings: ProviderSettingsDefinition<TSettings>;
  state: ProviderStateDefinition<TState>;
  display: ProviderDisplaySettingsDefinition<TState, TDisplayValue>;
  computables: ProviderComputablesDefinition<TComputables>;
  mount(
    context: ProviderInstanceHandleContext<TDisplayValue, TComputables, TConditions, TSettings, TState>,
  ): StatsPlusAPI.CleanupFunction | undefined;
}

export class ProviderDefinition<
  TDisplayValue = unknown,
  TComputables extends StatsPlusAPI.ComputableListDefinition = StatsPlusAPI.ComputableListDefinition,
  TConditions extends StatsPlusAPI.CompanionConditionListDefinition = StatsPlusAPI.CompanionConditionListDefinition,
  TSettings extends StatsPlusAPI.SettingListDefinition = StatsPlusAPI.SettingListDefinition,
  TState extends StatsPlusAPI.StateListDefinition = StatsPlusAPI.StateListDefinition,
> {
  public constructor(
    private readonly options: ProviderDefinitionConstructorOptions<
      TDisplayValue,
      TComputables,
      TConditions,
      TSettings,
      TState
    >,
  ) {}

  public getName(): string {
    return this.options.name;
  }

  public getDescription(): string {
    return this.options.description;
  }

  public getPreferredColor(): ProviderColor {
    return this.options.preferredColor;
  }

  public getExtension(): ProviderExtension {
    return this.options.extension;
  }

  public getComputables(): ProviderComputablesDefinition<TComputables> {
    return this.options.computables;
  }

  public getCompanionConditions(): ProviderConditionsDefinition<TConditions> {
    return this.options.conditions;
  }

  public isStatSupported(stat: StatExtension): boolean {
    if (this.options.targets.size === 0) {
      return true;
    }

    return this.options.targets.has(stat);
  }

  public getSettings(): ProviderSettingsDefinition<TSettings> {
    return this.options.settings;
  }

  public getState(): ProviderStateDefinition<TState> {
    return this.options.state;
  }

  public getDisplaySettings(): ProviderDisplaySettingsDefinition<TState, TDisplayValue> {
    return this.options.display;
  }

  public mount(
    context: ProviderInstanceHandleContext<TDisplayValue, TComputables, TConditions, TSettings, TState>,
  ): ProviderInstanceHandle<TDisplayValue, TComputables, TConditions, TSettings, TState> {
    return new ProviderInstanceHandle(
      this,
      context,
      this.options.mount(context),
    );
  }
}
