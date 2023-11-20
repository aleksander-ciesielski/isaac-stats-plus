import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { Unvalidated } from "~/types/validation/Unvalidated";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { APIAddonValidator } from "~/validators/api/APIAddonValidator";
import { APIProviderValidator } from "~/validators/api/APIProviderValidator";
import { APIConditionValidator } from "~/validators/api/APIConditionValidator";
import { APIMiddlewareValidator } from "~/validators/api/APIMiddlewareValidator";
import { Inject } from "~/app/ioc/decorators/Inject";
import { APISettingValidator } from "~/validators/api/APISettingValidator";

@Singleton()
export class APIValidator {
  public constructor(
    @Inject(APIAddonValidator) private readonly apiAddonValidator: APIAddonValidator,
    @Inject(APIProviderValidator) private readonly apiProviderValidator: APIProviderValidator,
    @Inject(APISettingValidator) private readonly apiSettingValidator: APISettingValidator,
    @Inject(APIConditionValidator) private readonly apiConditionValidator: APIConditionValidator,
    @Inject(APIMiddlewareValidator) private readonly apiMiddlewareValidator: APIMiddlewareValidator,
  ) {}

  public validateAddon(addon: Unvalidated<StatsPlusAPI.Addon>): StatsPlusAPI.Addon {
    return this.apiAddonValidator.validate(addon);
  }

  public validateProvider<
    TDisplayValue,
    TComputables extends StatsPlusAPI.ComputableListDefinition,
    TConditions extends StatsPlusAPI.CompanionConditionListDefinition,
    TSettings extends StatsPlusAPI.SettingListDefinition,
    TState extends StatsPlusAPI.StateListDefinition,
  >(
    provider: Unvalidated<StatsPlusAPI.Provider<TDisplayValue, TComputables, TConditions, TSettings, TState>>,
  ): StatsPlusAPI.Provider<TDisplayValue, TComputables, TConditions, TSettings, TState> {
    return this.apiProviderValidator.validate(provider);
  }

  public validateToggleSetting(toggle: Unvalidated<StatsPlusAPI.ToggleSetting>): StatsPlusAPI.ToggleSetting {
    return this.apiSettingValidator.validateToggleSetting(toggle);
  }

  public validateSelectSetting<TOption extends StatsPlusAPI.SelectSettingAllowedValue>(
    select: Unvalidated<StatsPlusAPI.SelectSetting<TOption>>,
  ): StatsPlusAPI.SelectSetting<TOption> {
    return this.apiSettingValidator.validateSelectSetting(select);
  }

  public validateRangeSetting(range: Unvalidated<StatsPlusAPI.RangeSetting>): StatsPlusAPI.RangeSetting {
    return this.apiSettingValidator.validateRangeSetting(range);
  }

  public validateCondition(
    condition: Unvalidated<StatsPlusAPI.StandaloneConditionDefinition>,
  ): StatsPlusAPI.StandaloneConditionDefinition {
    return this.apiConditionValidator.validateStandaloneCondition(condition);
  }

  public validateMiddleware<TArgs extends unknown[], TReturnType>(
    middleware: Unvalidated<StatsPlusAPI.Middleware<TArgs, TReturnType>>,
  ): StatsPlusAPI.Middleware<TArgs, TReturnType> {
    return this.apiMiddlewareValidator.validate(middleware);
  }
}
