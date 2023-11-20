import type { Unvalidated } from "~/types/validation/Unvalidated";
import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { ErrorWithContext } from "~/errors/ErrorWithContext";
import { isValidId } from "~/util/validation/isValidId";

@Singleton()
export class APIConditionValidator {
  public validateStandaloneCondition(
    condition: Unvalidated<StatsPlusAPI.StandaloneConditionDefinition>,
  ): StatsPlusAPI.StandaloneConditionDefinition {
    return {
      id: this.validateId(condition?.id as Unvalidated<string>),
      name: this.validateName(condition?.name as Unvalidated<string>),
      description: this.validateDescription(condition?.description as Unvalidated<string>),
      mount: this.validateMountFunction(condition?.mount),
    };
  }

  public validateCompanionCondition(
    condition: Unvalidated<StatsPlusAPI.CompanionConditionDefinition>,
  ): StatsPlusAPI.CompanionConditionDefinition {
    return {
      id: this.validateId(condition?.id as Unvalidated<string>),
      name: this.validateName(condition?.name as Unvalidated<string>),
      description: this.validateDescription(condition?.description as Unvalidated<string>),
    };
  }

  private validateId(id: Unvalidated<string>): string {
    if (typeof id !== "string") {
      throw new ErrorWithContext("Expected condition id (`.id`) to be a string.", {
        id,
        idType: typeof id,
      });
    }

    if (id.length === 0) {
      throw new Error("Expected condition id (`.id`) to not be empty.");
    }

    if (!isValidId(id)) {
      throw new ErrorWithContext(
        "Expected condition id (`.id`) to contain only lowercase letters, digits and hyphen-minus signs.",
        { id },
      );
    }

    return id;
  }

  private validateName(name: Unvalidated<string>): string {
    if (typeof name !== "string") {
      throw new ErrorWithContext("Expected condition name (`.name`) to be a string.", {
        name,
        nameType: typeof name,
      });
    }

    if (name.length === 0) {
      throw new Error("Expected condition name (`.name`) to not be empty.");
    }

    return name;
  }

  private validateDescription(description: Unvalidated<string>): string {
    if (typeof description !== "string") {
      throw new ErrorWithContext("Expected condition description (`.description`) to be a string.", {
        description,
        descriptionType: typeof description,
      });
    }

    if (description.length === 0) {
      throw new Error("Expected condition description (`.description`) to not be empty.");
    }

    return description;
  }

  private validateMountFunction(
    mount: Unvalidated<StatsPlusAPI.StandaloneConditionDefinition["mount"]>,
  ): StatsPlusAPI.StandaloneConditionDefinition["mount"] {
    if (typeof mount !== "function") {
      throw new ErrorWithContext("Expected condition mount function (`.mount`) to be a function.", {
        mount,
        mountType: typeof mount,
      });
    }

    return mount as StatsPlusAPI.StandaloneConditionDefinition["mount"];
  }
}
