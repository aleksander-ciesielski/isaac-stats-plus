import type { MiddlewareComputableContext } from "~/middleware/MiddlewareComputableContext";
import type { ComputableRef } from "~/middleware/ComputableRef";
import type { MiddlewareIntermediateValue } from "~/middleware/MiddlewareIntermediateValue";

export interface Middleware<TArgs extends unknown[], TReturnType> {
  id: string;
  name: string;
  description: string;
  target: ComputableRef;
  priority: number;
  intercept(this: void, ctx: MiddlewareComputableContext<TArgs, TReturnType>): MiddlewareIntermediateValue<TReturnType>;
}
