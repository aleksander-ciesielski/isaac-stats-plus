import type * as StatsPlusAPI from "@isaac-stats-plus/api";

export class MiddlewareIntermediateValue<TReturnType>
implements StatsPlusAPI.MiddlewareIntermediateValue<TReturnType> {
  public static from<TReturnType>(
    intermediateValue: StatsPlusAPI.MiddlewareIntermediateValue<TReturnType>,
  ): MiddlewareIntermediateValue<TReturnType> {
    return new MiddlewareIntermediateValue(
      intermediateValue.done,
      intermediateValue.value,
    );
  }

  private constructor(
    public readonly done: boolean,
    public readonly value: TReturnType,
  ) {}
}
