import type { Unvalidated } from "~/types/validation/Unvalidated";
import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { ErrorWithContext } from "~/errors/ErrorWithContext";

@Singleton()
export class APISettingCommonValidator {
  public validateName(name: Unvalidated<string>): string {
    if (typeof name !== "string" || name.length === 0) {
      throw new ErrorWithContext("Expected setting name (`.name`) to be a non-empty string.", {
        name,
        nameType: typeof name,
      });
    }

    return name;
  }

  public validateDescription(description: Unvalidated<string>): string {
    if (typeof description !== "string" || description.length === 0) {
      throw new ErrorWithContext("Expected setting description (`.description`) to be a non-empty string.", {
        description,
        descriptionType: typeof description,
      });
    }

    return description;
  }

  public validateInitialValueGetter<TValue>(
    initial: Unvalidated<StatsPlusAPI.Setting<TValue>["initial"]>,
  ): StatsPlusAPI.Setting<TValue>["initial"] {
    if (typeof initial !== "function") {
      throw new ErrorWithContext("Expected setting initial value getter (`.initial`) to be a function.", {
        initialValueGetterType: typeof initial,
      });
    }

    return initial as StatsPlusAPI.Setting<TValue>["initial"];
  }
}
