import type { Unvalidated } from "~/types/validation/Unvalidated";
import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { ErrorWithContext } from "~/errors/ErrorWithContext";
import { isValidId } from "~/util/validation/isValidId";

@Singleton()
export class APIMiddlewareValidator {
  public validate<TArgs extends unknown[], TReturnType>(
    middleware: Unvalidated<StatsPlusAPI.Middleware<TArgs, TReturnType>>,
  ): StatsPlusAPI.Middleware<TArgs, TReturnType> {
    return {
      id: this.validateId(middleware?.id as Unvalidated<string>),
      name: this.validateName(middleware?.name as Unvalidated<string>),
      description: this.validateDescription(middleware?.description as Unvalidated<string>),
      target: this.validateTarget(middleware?.target),
      priority: this.validatePriority(middleware?.priority as Unvalidated<number>),
      intercept: this.validateIntercept(middleware?.intercept),
    };
  }

  private validateId(id: Unvalidated<string>): string {
    if (typeof id !== "string") {
      throw new ErrorWithContext("Expected middleware id (`.id`) to be a string.", {
        id,
        idType: typeof id,
      });
    }

    if (id.length === 0) {
      throw new Error("Expected middleware id (`.id`) to not be an empty string.");
    }

    if (!isValidId(id)) {
      throw new ErrorWithContext(
        "Expected middleware id (`.id`) to contain only lowercase letters, digits and hyphen-minus signs.",
        { id },
      );
    }

    return id;
  }

  private validateName(name: Unvalidated<string>): string {
    if (typeof name !== "string") {
      throw new ErrorWithContext("Expected middleware name (`.name`) to be a string.", {
        name,
        nameType: typeof name,
      });
    }

    if (name.length === 0) {
      throw new Error("Expected middleware name (`.name`) to not be an empty string.");
    }

    return name;
  }

  private validateDescription(description: Unvalidated<string>): string {
    if (typeof description !== "string") {
      throw new ErrorWithContext("Expected middleware description (`.description`) to be a string.", {
        description,
        descriptionType: typeof description,
      });
    }

    if (description.length === 0) {
      throw new Error("Expected middleware description (`.description`) to not be empty.");
    }

    return description;
  }

  private validateTarget(target: Unvalidated<StatsPlusAPI.ComputableRef>): StatsPlusAPI.ComputableRef {
    if (typeof target !== "object") {
      throw new ErrorWithContext("Expected computable target (`.target`) to be an object.", {
        target,
        targetType: typeof target,
      });
    }

    if (typeof target.provider?.addon !== "string") {
      // eslint-disable-next-line max-len
      throw new ErrorWithContext("Expected computable target provider addon (`.target.provider.addon`) to be a string.", {
        addon: target.provider?.addon,
        addonType: typeof target.provider?.addon,
      });
    }

    if (typeof target.provider?.id !== "string") {
      throw new ErrorWithContext("Expected computable target provider id (`.target.provider.id`) to be a string.", {
        id: target.provider?.id,
        idType: typeof target.provider.id,
      });
    }

    if (typeof target.computable !== "string") {
      throw new ErrorWithContext("Expected computable target computable (`.target.computable`) to be a string.", {
        computable: target.computable,
        computableType: typeof target.computable,
      });
    }

    return target as StatsPlusAPI.ComputableRef;
  }

  private validatePriority(priority: Unvalidated<number>): number {
    if (typeof priority !== "number" || priority % 1 > 0) {
      throw new ErrorWithContext("Expected middleware priority (`.priority`) to be an integer number.", {
        priority,
        priorityType: typeof priority,
      });
    }

    if (0 > priority) {
      throw new ErrorWithContext("Expected middleware priority (`.priority`) to be positive.", {
        priority,
      });
    }

    return priority;
  }

  private validateIntercept<TArgs extends unknown[], TReturnType>(
    intercept: Unvalidated<StatsPlusAPI.Middleware<TArgs, TReturnType>["intercept"]>,
  ): StatsPlusAPI.Middleware<TArgs, TReturnType>["intercept"] {
    if (typeof intercept !== "function") {
      throw new ErrorWithContext("Expected middleware intercept function (`.intercept`) to be a function.", {
        intercept,
        interceptType: typeof intercept,
      });
    }

    return intercept as StatsPlusAPI.Middleware<TArgs, TReturnType>["intercept"];
  }
}
