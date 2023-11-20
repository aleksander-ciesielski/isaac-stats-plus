import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { ComputableExtension } from "~/entities/extension/provider/computable/ComputableExtension";
import { MiddlewareIntermediateValue } from "~/entities/extension/middleware/MiddlewareIntermediateValue";
import { MiddlewareExtension } from "~/entities/extension/middleware/MiddlewareExtension";
import { ProviderExtension } from "~/entities/extension/provider/ProviderExtension";
import { ErrorWithContext } from "~/errors/ErrorWithContext";

export class Middleware<TArgs extends unknown[], TReturnType> {
  private readonly extension: MiddlewareExtension;
  private readonly targetComputableExtension: ComputableExtension;

  public constructor(
    private readonly addonId: string,
    private readonly middleware: StatsPlusAPI.Middleware<TArgs, TReturnType>,
  ) {
    this.extension = new MiddlewareExtension({
      addon: this.addonId,
      id: this.middleware.id,
    });

    this.targetComputableExtension = new ComputableExtension(
      new ProviderExtension(this.middleware.target.provider),
      this.middleware.target.computable,
    );
  }

  public getExtension(): MiddlewareExtension {
    return this.extension;
  }

  public getTargetComputableExtension(): ComputableExtension {
    return this.targetComputableExtension;
  }

  public getPriority(): number {
    return this.middleware.priority;
  }

  public intercept(
    args: TArgs,
    current: TReturnType,
  ): MiddlewareIntermediateValue<TReturnType> {
    const intermediateValue = this.middleware.intercept({
      args,
      current,
      ignore() {
        return MiddlewareIntermediateValue.from({
          value: current,
          done: false,
        });
      },
      updateWith(value: TReturnType) {
        return MiddlewareIntermediateValue.from({
          value,
          done: false,
        });
      },
      finishWith(value: TReturnType) {
        return MiddlewareIntermediateValue.from({
          value,
          done: true,
        });
      },
    });

    if (!(intermediateValue instanceof MiddlewareIntermediateValue)) {
      throw new ErrorWithContext(
        "Middleware .intercept(ctx) function must return an intermediate value"
        + " from either ctx.ignore(), ctx.updateWith(value) or ctx.finishWith(value)",
        { intermediateValue },
      );
    }

    return intermediateValue;
  }
}
