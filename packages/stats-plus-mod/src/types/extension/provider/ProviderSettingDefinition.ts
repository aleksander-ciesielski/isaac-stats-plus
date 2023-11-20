export interface ProviderSettingDefinition<TValue> {
  getKey(): string;
  getName(): string;
  getInitialValue(): TValue;
}
