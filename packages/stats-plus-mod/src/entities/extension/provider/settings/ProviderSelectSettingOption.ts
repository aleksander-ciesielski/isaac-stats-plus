export class ProviderSelectSettingOption<TValue> {
  public constructor(
    private readonly name: string,
    private readonly value: TValue,
  ) {}

  public getName(): string {
    return this.name;
  }

  public getValue(): TValue {
    return this.value;
  }
}
