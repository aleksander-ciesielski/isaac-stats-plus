import type { State } from "~/provider/state/State";

export type StateListDefinition = Record<keyof never, State<any>>;
