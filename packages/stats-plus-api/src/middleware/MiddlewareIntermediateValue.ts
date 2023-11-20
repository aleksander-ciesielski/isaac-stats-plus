export interface MiddlewareIntermediateValue<TReturnType> {
  value: TReturnType;
  done: boolean;
}
