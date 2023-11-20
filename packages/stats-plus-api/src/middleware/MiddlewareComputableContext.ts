import type { MiddlewareIntermediateValue } from "~/middleware/MiddlewareIntermediateValue";

export interface MiddlewareComputableContext<
  TArgs extends unknown[],
  TReturnType,
> {
  readonly args: TArgs;
  readonly current: TReturnType;
  ignore(): MiddlewareIntermediateValue<TReturnType>;
  updateWith(value: TReturnType): MiddlewareIntermediateValue<TReturnType>;
  finishWith(value: TReturnType): MiddlewareIntermediateValue<TReturnType>;
}
