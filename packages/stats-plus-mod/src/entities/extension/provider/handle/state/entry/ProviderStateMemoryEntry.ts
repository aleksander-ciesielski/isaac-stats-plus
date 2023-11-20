import type { ProviderStateEntry } from "~/entities/extension/provider/handle/state/ProviderStateEntry";

export class ProviderStateMemoryEntry<TValue> implements ProviderStateEntry<TValue> {
  private value: TValue | undefined;

  public getValue(): TValue | undefined {
    return this.value;
  }

  public setValue(value: TValue): void {
    this.value = value;
  }
}
