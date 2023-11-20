export interface ProviderStateEntry<TValue> {
  setValue(value: TValue): void;
  getValue(): TValue | undefined;
}
