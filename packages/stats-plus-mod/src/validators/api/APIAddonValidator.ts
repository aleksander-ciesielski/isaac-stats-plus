import type { Unvalidated } from "~/types/validation/Unvalidated";
import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { APIProviderValidator } from "~/validators/api/APIProviderValidator";
import { APIConditionValidator } from "~/validators/api/APIConditionValidator";
import { APIMiddlewareValidator } from "~/validators/api/APIMiddlewareValidator";
import { Inject } from "~/app/ioc/decorators/Inject";
import { ErrorWithContext } from "~/errors/ErrorWithContext";
import { isValidId } from "~/util/validation/isValidId";

@Singleton()
export class APIAddonValidator {
  public constructor(
    @Inject(APIProviderValidator) private readonly apiProviderValidator: APIProviderValidator,
    @Inject(APIConditionValidator) private readonly apiConditionValidator: APIConditionValidator,
    @Inject(APIMiddlewareValidator) private readonly apiMiddlewareValidator: APIMiddlewareValidator,
  ) {}

  public validate(addon: Unvalidated<StatsPlusAPI.Addon>): StatsPlusAPI.Addon {
    return {
      id: this.validateId(addon?.id as Unvalidated<string>),
      name: this.validateName(addon?.name as Unvalidated<string>),
      providers: this.validateProviders(
        addon?.providers as Unvalidated<StatsPlusAPI.Provider[]>,
      ),
      conditions: this.validateConditions(
        addon?.conditions as Unvalidated<StatsPlusAPI.StandaloneConditionDefinition[]>,
      ),
      middleware: this.validateMiddleware(
        addon?.middleware as Unvalidated<StatsPlusAPI.Middleware<unknown[], unknown>[]>,
      ),
    };
  }

  private validateId(addonId: Unvalidated<string>): string {
    if (typeof addonId !== "string") {
      throw new ErrorWithContext("Expected addon id (`.id`) to be a string.", {
        addonId,
        addonIdType: typeof addonId,
      });
    }

    if (addonId.length === 0) {
      throw new Error("Expected addon id (`.id`) to not be of 0-length.");
    }

    if (!isValidId(addonId)) {
      throw new Error("Expected addon id (`.id`) to contain only lowercase letters, digits and hyphen-minus signs.");
    }

    return addonId;
  }

  private validateName(addonName: Unvalidated<string>): string {
    if (typeof addonName !== "string") {
      throw new ErrorWithContext("Expected addon name (`.name`) to be a string.", {
        addonName,
        addonNameType: typeof addonName,
      });
    }

    if (addonName.length === 0) {
      throw new Error("Expected addon name (`.name`) to not be of 0-length.");
    }

    return addonName;
  }

  private validateProviders(
    providers: Unvalidated<StatsPlusAPI.Provider[]>,
  ): StatsPlusAPI.Provider[] | undefined {
    if (providers === undefined) {
      return undefined;
    }

    if (!Array.isArray(providers)) {
      throw new ErrorWithContext("Expected addon providers (`.providers`) to be an array.", {
        providers,
        providersType: typeof providers,
      });
    }

    return providers.map((provider) => this.apiProviderValidator.validate(provider));
  }

  private validateConditions(
    conditions: Unvalidated<StatsPlusAPI.StandaloneConditionDefinition[]>,
  ): StatsPlusAPI.StandaloneConditionDefinition[] | undefined {
    if (conditions === undefined) {
      return conditions;
    }

    if (!Array.isArray(conditions)) {
      throw new ErrorWithContext("Expected addon conditions (`.conditions`) to be an array.", {
        conditions,
        conditionsType: typeof conditions,
      });
    }

    return conditions.map((condition) => this.apiConditionValidator.validateStandaloneCondition(condition));
  }

  private validateMiddleware(
    middlewareArray: Unvalidated<StatsPlusAPI.Middleware<unknown[], unknown>[]>,
  ): StatsPlusAPI.Middleware<unknown[], unknown>[] | undefined {
    if (middlewareArray === undefined) {
      return middlewareArray;
    }

    if (!Array.isArray(middlewareArray)) {
      throw new ErrorWithContext("Expected addon middleware (`.middleware`) to be an array.", {
        middleware: middlewareArray,
        middlewareType: typeof middlewareArray,
      });
    }

    return middlewareArray.map((middleware) => this.apiMiddlewareValidator.validate(middleware));
  }
}
