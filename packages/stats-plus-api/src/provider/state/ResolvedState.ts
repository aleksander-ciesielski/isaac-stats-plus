import type { StateListDefinition } from "~/provider/state/StateListDefinition";
import type { State } from "~/provider/state/State";
import type { StateHandle } from "~/provider/state/StateHandle";

export type ResolvedState<TState extends StateListDefinition> = {
  readonly [K in keyof TState]: TState[K] extends State<infer TValue> ? StateHandle<TValue> : never;
};
