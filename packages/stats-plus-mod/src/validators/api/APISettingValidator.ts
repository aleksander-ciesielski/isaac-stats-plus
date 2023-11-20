import type { Unvalidated } from "~/types/validation/Unvalidated";
import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { ErrorWithContext } from "~/errors/ErrorWithContext";
import { Inject } from "~/app/ioc/decorators/Inject";
import { APIToggleSettingValidator } from "~/validators/api/settings/APIToggleSettingValidator";
import { APISelectSettingValidator } from "~/validators/api/settings/APISelectSettingValidator";
import { APIRangeSettingValidator } from "~/validators/api/settings/APIRangeSettingValidator";

@Singleton()
export class APISettingValidator {
  public constructor(
    @Inject(APIToggleSettingValidator) private readonly apiToggleSettingValidator: APIToggleSettingValidator,
    @Inject(APISelectSettingValidator) private readonly apiSelectSettingValidator: APISelectSettingValidator,
    @Inject(APIRangeSettingValidator) private readonly apiRangeSettingValidator: APIRangeSettingValidator,
  ) {}

  public validateSetting(setting: Unvalidated<StatsPlusAPI.Setting<unknown>>): StatsPlusAPI.Setting<unknown> {
    if (setting?.type === "TOGGLE") {
      return this.validateToggleSetting(setting as Unvalidated<StatsPlusAPI.ToggleSetting>);
    }

    if (setting?.type === "RANGE") {
      return this.validateRangeSetting(setting as Unvalidated<StatsPlusAPI.RangeSetting>);
    }

    if (setting?.type === "SELECT") {
      // eslint-disable-next-line max-len
      return this.validateSelectSetting(setting as Unvalidated<StatsPlusAPI.SelectSetting<StatsPlusAPI.SelectSettingAllowedValue>>);
    }

    throw new ErrorWithContext("Unknown setting type.", {
      settingType: setting?.type,
    });
  }

  public validateToggleSetting(toggle: Unvalidated<StatsPlusAPI.ToggleSetting>): StatsPlusAPI.ToggleSetting {
    return this.apiToggleSettingValidator.validateToggleSetting(toggle);
  }

  public validateSelectSetting<TOption extends StatsPlusAPI.SelectSettingAllowedValue>(
    select: Unvalidated<StatsPlusAPI.SelectSetting<TOption>>,
  ): StatsPlusAPI.SelectSetting<TOption> {
    return this.apiSelectSettingValidator.validateSelectSetting(select);
  }

  public validateRangeSetting(range: Unvalidated<StatsPlusAPI.RangeSetting>): StatsPlusAPI.RangeSetting {
    return this.apiRangeSettingValidator.validateRangeSetting(range);
  }
}
