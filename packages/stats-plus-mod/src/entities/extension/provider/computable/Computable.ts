import type { Middleware } from "~/entities/extension/middleware/Middleware";
import type { MiddlewareExtension } from "~/entities/extension/middleware/MiddlewareExtension";
import { MiddlewareIntermediateValue } from "~/entities/extension/middleware/MiddlewareIntermediateValue";
import { HashMap } from "~/structures/HashMap";

export class Computable<TArgs extends unknown[], TReturnType> {
  private readonly middleware = new HashMap<MiddlewareExtension, Middleware<TArgs, TReturnType>>();

  private sortedMiddleware: Middleware<TArgs, TReturnType>[] = [];

  public registerMiddleware(middleware: Middleware<TArgs, TReturnType>): void {
    if (this.has(middleware.getExtension())) {
      return;
    }

    this.middleware.set(middleware.getExtension(), middleware);
    this.sortMiddlewareByPriority();
  }

  public has(middleware: MiddlewareExtension): boolean {
    return this.middleware.has(middleware);
  }

  public compute(args: TArgs, initial: TReturnType): TReturnType {
    let current = MiddlewareIntermediateValue.from({ value: initial, done: false });

    // eslint-disable-next-line no-restricted-syntax
    for (const middleware of this.sortedMiddleware) {
      current = middleware.intercept(args, current.value);
      if (current.done) {
        break;
      }
    }

    return current.value;
  }

  private sortMiddlewareByPriority(): void {
    this.sortedMiddleware = Array.from(this.middleware.values())
      .sort((a, b) => a.getPriority() - b.getPriority());
  }
}
