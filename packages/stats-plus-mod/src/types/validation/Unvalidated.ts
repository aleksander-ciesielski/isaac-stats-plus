export type Unvalidated<TValue> = {
  [K in keyof TValue]: TValue[K] extends Unvalidated<object>
    ? Unvalidated<TValue[K]>
    : unknown;
} | undefined;
