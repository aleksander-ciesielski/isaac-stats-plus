import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { Unvalidated } from "~/types/validation/Unvalidated";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { APISettingCommonValidator } from "~/validators/api/settings/APISettingCommonValidator";
import { ErrorWithContext } from "~/errors/ErrorWithContext";

@Singleton()
export class APISelectSettingValidator {
  public constructor(
    @Inject(APISettingCommonValidator) private readonly apiSettingCommonValidator: APISettingCommonValidator,
  ) {}

  public validateSelectSetting<TOption extends StatsPlusAPI.SelectSettingAllowedValue>(
    select: Unvalidated<StatsPlusAPI.SelectSetting<TOption>>,
  ): StatsPlusAPI.SelectSetting<TOption> {
    return {
      type: "SELECT",
      options: this.validateOptions(select?.options),
      name: this.apiSettingCommonValidator.validateName(select?.name as Unvalidated<string>),
      description: this.apiSettingCommonValidator.validateDescription(select?.description as Unvalidated<string>),
      initial: this.apiSettingCommonValidator.validateInitialValueGetter(select?.initial),
    };
  }

  private validateOptions<TOption extends StatsPlusAPI.SelectSettingAllowedValue>(
    options: Unvalidated<StatsPlusAPI.ResolvedSelectOptions<TOption>>,
  ): StatsPlusAPI.ResolvedSelectOptions<TOption> {
    if (!Array.isArray(options)) {
      throw new ErrorWithContext("Expected select setting options (`.options`) to be an array.", {
        options,
        optionsType: typeof options,
      });
    }

    return options.map((option) => this.validateOption(option));
  }

  private validateOption<TOption extends StatsPlusAPI.SelectSettingAllowedValue>(
    option: Unvalidated<StatsPlusAPI.SelectOption<TOption>>,
  ): StatsPlusAPI.SelectOption<TOption> {
    if (typeof option !== "object") {
      throw new ErrorWithContext("Expected select setting options element to be an object.", {
        option,
        optionType: typeof option,
      });
    }

    if (typeof option?.name !== "string" || option.name.length === 0) {
      throw new Error("Expected select setting option's name to be a non-empty string.");
    }

    if (
      typeof option?.value !== "string"
      && typeof option?.value !== "boolean"
      && typeof option?.value !== "number"
    ) {
      // eslint-disable-next-line max-len
      throw new ErrorWithContext("Expected select setting option's value to be either a string, a number or a boolean", {
        optionName: option?.name,
        optionValue: option?.value,
        optionValueType: typeof option?.value,
      });
    }

    return option as StatsPlusAPI.SelectOption<TOption>;
  }
}
