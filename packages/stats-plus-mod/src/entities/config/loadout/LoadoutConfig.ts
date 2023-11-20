import type { LoadoutConfigEntry } from "~/entities/config/loadout/LoadoutConfigEntry";
import type { ProviderExtension } from "~/entities/extension/provider/ProviderExtension";
import type { AnyConditionExtension } from "~/types/extension/condition/AnyConditionExtension";
import type { HashMap } from "~/structures/HashMap";
import type { StatExtension } from "~/entities/extension/stat/StatExtension";
import { StandaloneConditionExtension } from "~/entities/extension/condition/standalone/StandaloneConditionExtension";
import { HashSet } from "~/structures/HashSet";
import { ErrorWithContext } from "~/errors/ErrorWithContext";

export interface LoadoutConfigCreateOptions {
  entries: HashMap<StatExtension, LoadoutConfigEntry>;
}

export class LoadoutConfig {
  private readonly loadoutEntries: HashMap<StatExtension, LoadoutConfigEntry>;

  public constructor(options: LoadoutConfigCreateOptions) {
    this.loadoutEntries = options.entries;
  }

  public clone(): LoadoutConfig {
    return new LoadoutConfig({
      entries: this.loadoutEntries.clone(),
    });
  }

  public getActiveStats(): StatExtension[] {
    return Array.from(this.loadoutEntries.keys());
  }

  public getPrimaryProvider(
    stat: StatExtension,
  ): ProviderExtension {
    return this.getLoadoutEntry(stat).getPrimaryProvider();
  }

  public getSecondaryProvider(
    stat: StatExtension,
  ): ProviderExtension {
    return this.getLoadoutEntry(stat).getSecondaryProvider();
  }

  public getCondition(
    stat: StatExtension,
  ): AnyConditionExtension {
    return this.getLoadoutEntry(stat).getCondition();
  }

  public setPrimaryProvider(
    stat: StatExtension,
    primaryProvider: ProviderExtension,
  ): void {
    this.getLoadoutEntry(stat).setPrimaryProvider(primaryProvider);
  }

  public setSecondaryProvider(
    stat: StatExtension,
    secondaryProvider: ProviderExtension,
  ): void {
    this.getLoadoutEntry(stat).setSecondaryProvider(secondaryProvider);
  }

  public setCondition(
    stat: StatExtension,
    condition: AnyConditionExtension,
  ): void {
    this.getLoadoutEntry(stat).setCondition(condition);
  }

  public getLoadoutEntry(stat: StatExtension): LoadoutConfigEntry {
    const entry = this.loadoutEntries.get(stat);
    if (entry === undefined) {
      throw new ErrorWithContext("Could not find entry for the given stat.", {
        addonId: stat.addonId,
        statId: stat.statId,
      });
    }

    return entry;
  }

  public getCurrentlyUsedProviders(): ProviderExtension[] {
    const providers = new HashSet(Array.from(this.loadoutEntries.values())
      .flatMap((entry) => {
        const condition = entry.getCondition();
        if (condition instanceof StandaloneConditionExtension && condition.isAlwaysCondition()) {
          return [entry.getPrimaryProvider()];
        }

        return [entry.getPrimaryProvider(), entry.getSecondaryProvider()];
      }));

    return Array.from(providers.values());
  }
}
