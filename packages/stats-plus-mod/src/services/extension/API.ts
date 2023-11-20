import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { Unvalidated } from "~/types/validation/Unvalidated";
import { ModCallback } from "isaac-typescript-definitions";
import { Logger } from "~/Logger";
import { LifecycleService } from "~/services/LifecycleService";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { ModCallbackService } from "~/services/menu/ModCallbackService";
import { ExtensionService } from "~/services/extension/ExtensionService";
import { StandaloneConditionDefinition } from "~/entities/extension/condition/standalone/StandaloneConditionDefinition";
import { Middleware } from "~/entities/extension/middleware/Middleware";
import { InjectionToken } from "~/app/ioc/InjectionToken";
import { speed } from "~/core/stats/speed";
import { tears } from "~/core/stats/tears";
import { damage } from "~/core/stats/damage";
import { range } from "~/core/stats/range";
import { shotSpeed } from "~/core/stats/shotSpeed";
import { luck } from "~/core/stats/luck";
import { APIProviderMapper } from "~/mappers/api/APIProviderMapper";
import { APIValidator } from "~/validators/api/APIValidator";

@Singleton()
export class API implements StatsPlusAPI.API {
  public readonly settings = {
    toggle: (options: StatsPlusAPI.ToggleSettingOptions): StatsPlusAPI.ToggleSetting => (
      this.apiValidator.validateToggleSetting({
        type: "TOGGLE",
        name: options.name,
        description: options.description,
        initial: options.initial,
      })
    ),
    select: <TOption extends StatsPlusAPI.SelectSettingAllowedValue>(
      options: StatsPlusAPI.SelectSettingOptions<TOption>,
    ): StatsPlusAPI.SelectSetting<TOption> => (
      this.apiValidator.validateSelectSetting({
        type: "SELECT",
        name: options.name,
        description: options.description,
        options: options.options,
        initial: options.initial,
      })
    ),
    range: (options: StatsPlusAPI.RangeSettingOptions): StatsPlusAPI.RangeSetting => (
      this.apiValidator.validateRangeSetting({
        type: "RANGE",
        name: options.name,
        description: options.description,
        min: options.min,
        max: options.max,
        initial: options.initial,
      })
    ),
  };

  public readonly stat = {
    speed: speed.getExternalAPI(),
    tears: tears.getExternalAPI(),
    damage: damage.getExternalAPI(),
    range: range.getExternalAPI(),
    shotSpeed: shotSpeed.getExternalAPI(),
    luck: luck.getExternalAPI(),
  };

  private readonly logger = Logger.for(API.name);

  public constructor(
    @Inject(InjectionToken.ModAPI) private readonly mod: Mod,
    @Inject(ModCallbackService) private readonly modCallbackService: ModCallbackService,
    @Inject(ExtensionService) private readonly extensionService: ExtensionService,
    @Inject(InjectionToken.IsaacAPI) private readonly isaac: typeof Isaac,
    @Inject(LifecycleService) private readonly lifecycleService: LifecycleService,
    @Inject(APIProviderMapper) private readonly apiProviderMapper: APIProviderMapper,
    @Inject(APIValidator) private readonly apiValidator: APIValidator,
  ) {}

  public setup(): void {
    this.processStatsPlusRegisterCallbacks();
    this.modCallbackService.addCallback(ModCallback.POST_UPDATE, this.processStatsPlusRegisterCallbacks.bind(this));
  }

  public middleware<TArgs extends unknown[], TReturnType>(
    middleware: StatsPlusAPI.Middleware<TArgs, TReturnType>,
  ): StatsPlusAPI.Middleware<TArgs, TReturnType> {
    return this.apiValidator.validateMiddleware(middleware);
  }

  public provider<
    TDisplayValue,
    TComputableList extends StatsPlusAPI.ComputableListDefinition = {},
    TCompanionConditionList extends StatsPlusAPI.CompanionConditionListDefinition = {},
    TSettings extends StatsPlusAPI.SettingListDefinition = {},
    TState extends StatsPlusAPI.StateListDefinition = {},
  >(
    provider: StatsPlusAPI.Provider<TDisplayValue, TComputableList, TCompanionConditionList, TSettings, TState>,
  ): StatsPlusAPI.Provider<TDisplayValue, TComputableList, TCompanionConditionList, TSettings, TState> {
    return this.apiValidator.validateProvider(provider) as any;
  }

  public condition(
    condition: StatsPlusAPI.StandaloneConditionDefinition,
  ): StatsPlusAPI.StandaloneConditionDefinition {
    return this.apiValidator.validateCondition(condition);
  }

  public register(unvalidatedAddon: Unvalidated<StatsPlusAPI.Addon>): void {
    try {
      const addon = this.apiValidator.validateAddon(unvalidatedAddon);

      addon.middleware?.forEach((middleware) => {
        this.extensionService.registerMiddleware(
          new Middleware(addon.id, middleware),
        );
      });

      addon.providers?.forEach((provider) => {
        this.extensionService.registerProvider(
          this.apiProviderMapper.mapAPIProvider(addon.id, provider),
        );
      });

      addon.conditions?.forEach((condition) => {
        this.extensionService.registerStandaloneCondition(
          new StandaloneConditionDefinition(addon.id, condition),
        );
      });

      this.logger.info("Requesting a full reload due to an addon register.");
      this.lifecycleService.reloadAll();
    } catch (e) {
      this.logger.error("An error occured during addon registration", e);
    }
  }

  public compareComputableRefs(
    first: StatsPlusAPI.ComputableRef,
    second: StatsPlusAPI.ComputableRef,
  ): boolean {
    return (
      this.compareExtensionRefs(first.provider, second.provider)
      && first.computable === second.computable
    );
  }

  public compareExtensionRefs(
    first: StatsPlusAPI.ExtensionRef,
    second: StatsPlusAPI.ExtensionRef,
  ): boolean {
    return (
      first.addon === second.addon
      && first.id === second.id
    );
  }

  private processStatsPlusRegisterCallbacks(): void {
    const callbacks = this.isaac.GetCallbacks("STATS_PLUS_REGISTER", true);
    callbacks.forEach((callback) => {
      if (callback === undefined) {
        return;
      }

      try {
        callback.Function(this);
      } catch (e) {
        this.logger.warn(
          "An error occured while executing 'STATS_PLUS_REGISTER' callback",
          { err: e },
        );
      } finally {
        this.mod.RemoveCallback("STATS_PLUS_REGISTER", callback.Function);
      }
    });
  }
}
