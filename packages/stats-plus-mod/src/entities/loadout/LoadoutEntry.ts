import type { ProviderInstanceHandle } from "~/entities/extension/provider/handle/ProviderInstanceHandle";
import type { StatSlot } from "~/entities/stat/StatSlot";
import type { ConditionInstanceHandle } from "~/entities/extension/condition/handle/ConditionInstanceHandle";

export class LoadoutEntry {
  public constructor(
    public readonly statSlot: StatSlot,
    public readonly condition: ConditionInstanceHandle,
    public readonly primaryProvider: ProviderInstanceHandle,
    public readonly secondaryProvider: ProviderInstanceHandle,
  ) {}

  public getActiveProvider(): ProviderInstanceHandle {
    return this.condition.isActive()
      ? this.primaryProvider
      : this.secondaryProvider;
  }

  public getInactiveProvider(): ProviderInstanceHandle {
    return this.condition.isActive()
      ? this.secondaryProvider
      : this.primaryProvider;
  }

  public unregister(): void {
    this.condition.unregister();
    this.primaryProvider.unregister();
    this.secondaryProvider.unregister();
  }
}
