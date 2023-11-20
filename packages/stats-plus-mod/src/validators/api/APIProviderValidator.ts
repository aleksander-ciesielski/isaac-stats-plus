import type { Unvalidated } from "~/types/validation/Unvalidated";
import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { ErrorWithContext } from "~/errors/ErrorWithContext";
import { isValidId } from "~/util/validation/isValidId";
import { Inject } from "~/app/ioc/decorators/Inject";
import { APISettingValidator } from "~/validators/api/APISettingValidator";
import { APIConditionValidator } from "~/validators/api/APIConditionValidator";
import { APIProviderStateValidator } from "~/validators/api/APIProviderStateValidator";

@Singleton()
export class APIProviderValidator {
  private static readonly AVAILABLE_COLORS = [
    "NONE",
    "GREY",
    "RED",
    "GREEN",
    "BLUE",
    "ORANGE",
    "MAGENTA",
    "CYAN",
  ] as const satisfies readonly StatsPlusAPI.ProviderColor[];

  public constructor(
    @Inject(APISettingValidator) private readonly apiSettingValidator: APISettingValidator,
    @Inject(APIConditionValidator) private readonly apiConditionValidator: APIConditionValidator,
    @Inject(APIProviderStateValidator) private readonly apiProviderStateValidator: APIProviderStateValidator,
  ) {}

  public validate<
    TDisplayValue,
    TComputables extends StatsPlusAPI.ComputableListDefinition,
    TConditions extends StatsPlusAPI.CompanionConditionListDefinition,
    TSettings extends StatsPlusAPI.SettingListDefinition,
    TState extends StatsPlusAPI.StateListDefinition,
  >(
    provider: Unvalidated<StatsPlusAPI.Provider<TDisplayValue, TComputables, TConditions, TSettings, TState>>,
  ): StatsPlusAPI.Provider<TDisplayValue, TComputables, TConditions, TSettings, TState> {
    return {
      id: this.validateId(provider?.id as Unvalidated<string>),
      name: this.validateName(provider?.name as Unvalidated<string>),
      description: this.validateDescription(provider?.description as Unvalidated<string>),
      targets: this.validateTargets(provider?.targets),
      display: this.validateDisplay(provider?.display),
      color: this.validateColor(provider?.color as Unvalidated<StatsPlusAPI.ProviderColor | undefined>),
      computables: this.validateComputables(provider?.computables as Unvalidated<TComputables>),
      conditions: this.validateConditions(provider?.conditions as Unvalidated<TConditions>),
      settings: this.validateSettings(provider?.settings as Unvalidated<TSettings>),
      state: this.apiProviderStateValidator.validateState(provider?.state as Unvalidated<TState>),
      mount: this.validateMount(provider?.mount),
    };
  }

  private validateId(id: Unvalidated<string>): string {
    if (typeof id !== "string") {
      throw new ErrorWithContext(
        "Expected provider id (`.id`) to be a string.",
        {
          id,
          idType: typeof id,
        },
      );
    }

    if (id.length === 0) {
      throw new Error("Expected provider id (`.id`) to not be empty.");
    }

    if (!isValidId(id)) {
      throw new ErrorWithContext(
        "Expected provider id (`.id`) to contain only lowercase letters, digits and hyphen-minus signs.",
        { id },
      );
    }

    return id;
  }

  private validateName(name: Unvalidated<string>): string {
    if (typeof name !== "string") {
      throw new ErrorWithContext(
        "Expected provider name (`.name`) to be a string.",
        {
          name,
          nameType: typeof name,
        },
      );
    }

    if (name.length === 0) {
      throw new Error("Expected provider name (`.name`) to not be empty.");
    }

    return name;
  }

  private validateDescription(description: Unvalidated<string>): string {
    if (typeof description !== "string") {
      throw new ErrorWithContext(
        "Expected provider description (`.description`) to be a string.",
        {
          description,
          descriptionType: typeof description,
        },
      );
    }

    if (description.length === 0) {
      throw new Error("Expected provider description (`.description`) to not be empty.");
    }

    return description;
  }

  private validateTargets(
    targets: Unvalidated<StatsPlusAPI.ExtensionRef[] | undefined>,
  ): StatsPlusAPI.ExtensionRef[] | undefined {
    if (targets === undefined) {
      return undefined;
    }

    if (!Array.isArray(targets)) {
      throw new ErrorWithContext(
        "Expected provider targets (`.targets`) to be an array.",
        {
          targets,
          targetsType: typeof targets,
        },
      );
    }

    if (targets.length === 0) {
      throw new Error(
        "Expected provider targets (`.targets`) to be a non-empty array."
        + "Don't set this property if you intend to target all stats.",
      );
    }

    return targets.map((target) => this.validateTarget(target));
  }

  private validateTarget(target: Unvalidated<StatsPlusAPI.ExtensionRef>): StatsPlusAPI.ExtensionRef {
    if (typeof target !== "object") {
      throw new ErrorWithContext(
        "Expected provider target to be an object.",
        {
          target,
          targetType: typeof target,
        },
      );
    }

    if (typeof target.addon !== "string") {
      throw new ErrorWithContext(
        "Expected provider target addon to be a string.",
        {
          addon: target.addon,
          addonType: typeof target.addon,
        },
      );
    }

    if (typeof target.id !== "string") {
      throw new ErrorWithContext(
        "Expected provider target id to be a string.",
        {
          id: target.id,
          idType: typeof target.id,
        },
      );
    }

    return target as StatsPlusAPI.ExtensionRef;
  }

  private validateDisplay<TDisplayValue, TState extends StatsPlusAPI.StateListDefinition>(
    display: Unvalidated<StatsPlusAPI.DisplaySettings<TState, TDisplayValue>>,
  ): StatsPlusAPI.DisplaySettings<TState, TDisplayValue> {
    if (typeof display !== "object" || display === null) {
      throw new ErrorWithContext(
        "Expected provider display settings (`display`) to be an object.",
        {
          display,
          displayType: typeof display,
        },
      );
    }

    if (typeof display.value !== "object" || display.value === null) {
      throw new ErrorWithContext(
        "Expected provider display value settings (`display.value`) to be an object.",
        {
          displayValue: display.value,
          displayValueType: typeof display.value,
        },
      );
    }

    if (typeof display.value.get !== "function") {
      throw new ErrorWithContext(
        "Expected provider display value getter (`display.value.get`) to be a function.",
        {
          displayValueGetter: display.value.get,
          displayValueGetterType: typeof display.value.get,
        },
      );
    }

    if (typeof display.value.format !== "function") {
      throw new ErrorWithContext(
        "Expected provider display value formatter (`display.value.format`) to be a function.",
        {
          displayValueFormatter: display.value.format,
          displayValueFormatterType: typeof display.value.format,
        },
      );
    }

    if (display.change !== undefined && (display.change === null || typeof display.change !== "object")) {
      throw new ErrorWithContext(
        "Expected provider display change settings (`display.change`) - if set - to be an object.",
        {
          displayChange: display.change,
          displayChangeType: typeof display.change,
        },
      );
    }

    if (display.change !== undefined && typeof display.change !== "object") {
      throw new ErrorWithContext(
        "Expected provider display change settings (`display.change`) to be an object.",
        {
          displayChange: display.change,
          displayChangeType: typeof display.change,
        },
      );
    }

    if (display.change !== undefined && typeof display.change.format !== "function") {
      throw new ErrorWithContext(
        "Expected provider display change formatter (`display.change.format`) to be a function.",
        {
          displayChangeFormatter: display.change.format,
          displayChangeFormatterType: typeof display.change.format,
        },
      );
    }

    if (display.change !== undefined && typeof display.change.compute !== "function") {
      throw new ErrorWithContext(
        "Expected provider display change compute function (`display.change.compute`) to be a function.",
        {
          displayChangeComputeFn: display.change.compute,
          displayChangeComputeFnType: typeof display.change.compute,
        },
      );
    }

    if (display.change?.isPositive !== undefined && typeof display.change.isPositive !== "function") {
      throw new ErrorWithContext(
        // eslint-disable-next-line max-len
        "Expected provider display change isPositive function (`display.change.isPositive`) - if set - to be a function.",
        {
          displayChangeIsPositiveFn: display.change.isPositive,
          displayChangeIsPositiveFnType: typeof display.change.isPositive,
        },
      );
    }

    return display as StatsPlusAPI.DisplaySettings<TState, TDisplayValue>;
  }

  private validateColor(
    color: Unvalidated<StatsPlusAPI.ProviderColor | undefined>,
  ): StatsPlusAPI.ProviderColor | undefined {
    if (color === undefined) {
      return undefined;
    }

    if (!APIProviderValidator.AVAILABLE_COLORS.includes(color)) {
      const availableColors = APIProviderValidator.AVAILABLE_COLORS
        .map((color) => `"${color}"`)
        .join(", ");

      throw new ErrorWithContext(
        `Expected provider color (\`.color\`) to be one of ${availableColors}.`,
        {
          color,
          colorType: typeof color,
        },
      );
    }

    return color;
  }

  private validateComputables<TComputables extends StatsPlusAPI.ComputableListDefinition>(
    computables: Unvalidated<TComputables | undefined>,
  ): TComputables | undefined {
    if (computables === undefined) {
      return undefined;
    }

    if (typeof computables !== "object" || computables === null) {
      throw new ErrorWithContext("Expected provider computables (`.computables`) to be an object.", {
        computables,
        computablesType: typeof computables,
      });
    }

    return Object.fromEntries(
      Object.entries(computables).map(([key, computable]) => [key, this.validateComputable(computable)]),
    ) as TComputables;
  }

  private validateComputable<TArgs extends any[], TReturnType>(
    computable: Unvalidated<StatsPlusAPI.ComputableDefinition<TArgs, TReturnType>>,
  ): StatsPlusAPI.ComputableDefinition<TArgs, TReturnType> {
    if (typeof computable !== "function") {
      throw new ErrorWithContext("Expected computable to be a function.", {
        computable,
        computableType: typeof computable,
      });
    }

    return computable as StatsPlusAPI.ComputableDefinition<TArgs, TReturnType>;
  }

  private validateConditions<TConditions extends StatsPlusAPI.CompanionConditionListDefinition>(
    conditions: Unvalidated<TConditions | undefined>,
  ): TConditions | undefined {
    if (conditions === undefined) {
      return undefined;
    }

    if (typeof conditions !== "object" || conditions === null) {
      throw new ErrorWithContext("Expected provider conditions (`.conditions`) to be an object.", {
        conditions,
        conditionsType: typeof conditions,
      });
    }

    return Object.fromEntries(
      Object.entries(conditions)
        .map(([key, condition]) => [key, this.apiConditionValidator.validateCompanionCondition(condition)]),
    ) as TConditions;
  }

  private validateSettings<TSettings extends StatsPlusAPI.SettingListDefinition>(
    settings: Unvalidated<TSettings>,
  ): TSettings | undefined {
    if (settings === undefined) {
      return undefined;
    }

    if (typeof settings !== "object" || settings === null) {
      throw new ErrorWithContext("Expected provider settings (.settings) to be an object.", {
        settings,
        settingsType: typeof settings,
      });
    }

    return Object.fromEntries(Object.entries(settings).map(([key, setting]) => [
      key,
      this.apiSettingValidator.validateSetting(setting),
    ])) as TSettings;
  }

  private validateMount<
    TDisplayValue,
    TComputables extends StatsPlusAPI.ComputableListDefinition,
    TConditions extends StatsPlusAPI.CompanionConditionListDefinition,
    TSettings extends StatsPlusAPI.SettingListDefinition,
    TState extends StatsPlusAPI.StateListDefinition,
  >(
    mount: Unvalidated<StatsPlusAPI.Provider<TDisplayValue, TComputables, TConditions, TSettings, TState>["mount"]>,
  ): StatsPlusAPI.Provider<TDisplayValue, TComputables, TConditions, TSettings, TState>["mount"] {
    if (typeof mount !== "function") {
      throw new ErrorWithContext(
        "Expected provider mount function (`.mount`) to be a function.",
        {
          mountFn: mount,
          mountFnType: typeof mount,
        },
      );
    }

    return mount as StatsPlusAPI.Provider<TDisplayValue, TComputables, TConditions, TSettings, TState>["mount"];
  }
}
