import type { StateEncoder } from "~/provider/state/StateEncoder";

export interface State<TValue> {
  persistent?: boolean;
  encoder?: StateEncoder<TValue>;
  initial(this: void): TValue;
}
