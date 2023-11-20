import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { Unvalidated } from "~/types/validation/Unvalidated";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { APISettingCommonValidator } from "~/validators/api/settings/APISettingCommonValidator";

@Singleton()
export class APIToggleSettingValidator {
  public constructor(
    @Inject(APISettingCommonValidator) private readonly apiSettingCommonValidator: APISettingCommonValidator,
  ) {}

  public validateToggleSetting(toggle: Unvalidated<StatsPlusAPI.ToggleSetting>): StatsPlusAPI.ToggleSetting {
    return {
      type: "TOGGLE",
      name: this.apiSettingCommonValidator.validateName(toggle?.name as Unvalidated<string>),
      description: this.apiSettingCommonValidator.validateDescription(toggle?.description as Unvalidated<string>),
      initial: this.apiSettingCommonValidator.validateInitialValueGetter(toggle?.initial),
    };
  }
}
