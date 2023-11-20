import type { ProviderExtension } from "~/entities/extension/provider/ProviderExtension";
import type { AnyConditionExtension } from "~/types/extension/condition/AnyConditionExtension";
import type { StatExtension } from "~/entities/extension/stat/StatExtension";

export interface LoadoutEntryOptions {
  stat: StatExtension;
  primaryProvider: ProviderExtension;
  secondaryProvider: ProviderExtension;
  condition: AnyConditionExtension;
}

export class LoadoutConfigEntry {
  private readonly stat: StatExtension;
  private primaryProvider: ProviderExtension;
  private secondaryProvider: ProviderExtension;
  private condition: AnyConditionExtension;

  public constructor(options: LoadoutEntryOptions) {
    this.stat = options.stat;
    this.primaryProvider = options.primaryProvider;
    this.secondaryProvider = options.secondaryProvider;
    this.condition = options.condition;
  }

  public getStat(): StatExtension {
    return this.stat;
  }

  public getPrimaryProvider(): ProviderExtension {
    return this.primaryProvider;
  }

  public setPrimaryProvider(provider: ProviderExtension): void {
    this.primaryProvider = provider;
  }

  public getSecondaryProvider(): ProviderExtension {
    return this.secondaryProvider;
  }

  public setSecondaryProvider(provider: ProviderExtension): void {
    this.secondaryProvider = provider;
  }

  public getCondition(): AnyConditionExtension {
    return this.condition;
  }

  public setCondition(condition: AnyConditionExtension): void {
    this.condition = condition;
  }
}
