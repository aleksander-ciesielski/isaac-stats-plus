import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { Unvalidated } from "~/types/validation/Unvalidated";
import type { Tuple } from "~/util/types/Tuple";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { APISettingCommonValidator } from "~/validators/api/settings/APISettingCommonValidator";
import { ErrorWithContext } from "~/errors/ErrorWithContext";

@Singleton()
export class APIRangeSettingValidator {
  public constructor(
    @Inject(APISettingCommonValidator) private readonly apiSettingCommonValidator: APISettingCommonValidator,
  ) {}

  public validateRangeSetting(range: Unvalidated<StatsPlusAPI.RangeSetting>): StatsPlusAPI.RangeSetting {
    const [min, max] = this.validateMinAndMaxValues(
      range?.min as Unvalidated<number>,
      range?.max as Unvalidated<number>,
    );

    return {
      type: "RANGE",
      min,
      max,
      name: this.apiSettingCommonValidator.validateName(range?.name as Unvalidated<string>),
      description: this.apiSettingCommonValidator.validateDescription(range?.description as Unvalidated<string>),
      initial: this.apiSettingCommonValidator.validateInitialValueGetter(range?.initial),
    };
  }

  private validateMinAndMaxValues(min: Unvalidated<number>, max: Unvalidated<number>): Tuple<2, number> {
    if (typeof min !== "number") {
      throw new ErrorWithContext("Expected range setting min value (`.min`) to be a number.", {
        min,
        minType: typeof min,
      });
    }

    if (typeof max !== "number") {
      throw new ErrorWithContext("Expected range setting max value (`.max`) to be a number.", {
        max,
        maxType: typeof max,
      });
    }

    if (min >= max) {
      // eslint-disable-next-line max-len
      throw new ErrorWithContext("Expected range setting min value (`.min`) to be greater than the max value (`.max`).", {
        min,
        max,
      });
    }

    return [min, max];
  }
}
