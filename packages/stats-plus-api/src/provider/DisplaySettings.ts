import type { StateListDefinition } from "~/provider/state/StateListDefinition";
import type { State } from "~/provider/state/State";

export interface DisplaySettings<TState extends StateListDefinition, TDisplayValue> {
  value: {
    get(this: void, state: TState): State<TDisplayValue> | undefined;
    format(this: void, value: TDisplayValue): string | undefined;
  };
  change?: {
    compute(this: void, prev: TDisplayValue, next: TDisplayValue): TDisplayValue | undefined;
    isPositive?(this: void, change: TDisplayValue): boolean;
    format(this: void, change: TDisplayValue, isPositive: boolean): string | undefined;
  };
}
