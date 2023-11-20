export interface StateHandle<TValue> {
  current(): TValue;
  set(value: TValue, silent?: boolean): void;
  reset(silent?: boolean): void;
}
