import type { LoadoutConfigEntry } from "~/entities/config/loadout/LoadoutConfigEntry";
import type { ConditionDefinition } from "~/types/extension/condition/ConditionDefinition";
import type { ProviderDefinition } from "~/entities/extension/provider/ProviderDefinition";
import type { Middleware } from "~/entities/extension/middleware/Middleware";
import type { ComputableExtension } from "~/entities/extension/provider/computable/ComputableExtension";
import type { AnyConditionExtension } from "~/types/extension/condition/AnyConditionExtension";
import type { StandaloneConditionDefinition } from "~/entities/extension/condition/standalone/StandaloneConditionDefinition";
import { Computable } from "~/entities/extension/provider/computable/Computable";
import { CompanionConditionExtension } from "~/entities/extension/condition/companion/CompanionConditionExtension";
import { ProviderExtension } from "~/entities/extension/provider/ProviderExtension";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { HashMap } from "~/structures/HashMap";
import { StandaloneConditionExtension } from "~/entities/extension/condition/standalone/StandaloneConditionExtension";
import { HashSet } from "~/structures/HashSet";
import { ErrorWithContext } from "~/errors/ErrorWithContext";
import { ALWAYS_CONDITION_ID, CORE_ADDON_ID, NULL_PROVIDER_ID } from "~/core/coreAddonConstants";

@Singleton()
export class ExtensionService {
  private static readonly FALLBACK_PROVIDER = new ProviderExtension({
    addon: CORE_ADDON_ID,
    id: NULL_PROVIDER_ID,
  });

  private static readonly FALLBACK_CONDITION = new StandaloneConditionExtension({
    addon: CORE_ADDON_ID,
    id: ALWAYS_CONDITION_ID,
  });

  private readonly computables = new HashMap<ComputableExtension, Computable<unknown[], unknown>>();
  private readonly providers = new HashMap<ProviderExtension, ProviderDefinition>();
  private readonly conditions = new HashMap<AnyConditionExtension, ConditionDefinition>();

  public registerMiddleware<TArgs extends unknown[], TReturnType>(middleware: Middleware<TArgs, TReturnType>): void {
    const targetComputableExtension = middleware.getTargetComputableExtension();

    if (!this.computables.has(targetComputableExtension)) {
      this.computables.set(targetComputableExtension, new Computable());
    }

    const computable = this.computables.get(targetComputableExtension)!;
    if (computable.has(middleware.getExtension())) {
      throw new ErrorWithContext(
        "Middleware already registered.",
        { addon: middleware.getExtension().addonId, id: middleware.getExtension().middlewareId },
      );
    }

    computable.registerMiddleware(middleware);
  }

  public registerProvider(provider: ProviderDefinition): void {
    if (this.providers.has(provider.getExtension())) {
      throw new ErrorWithContext(
        "Provider already registered.",
        { addon: provider.getExtension().addonId, id: provider.getExtension().providerId },
      );
    }

    this.providers.set(provider.getExtension(), provider);

    Array.from(provider.getCompanionConditions().getConditions().values()).forEach((condition) => {
      const conditionExtension = new CompanionConditionExtension(
        provider.getExtension(),
        condition.getId(),
      );

      this.registerCondition(conditionExtension, condition);
    });
  }

  public registerStandaloneCondition(condition: StandaloneConditionDefinition): void {
    const extension = new StandaloneConditionExtension({
      addon: condition.getExtension().addonId,
      id: condition.getId(),
    });

    if (this.conditions.has(extension)) {
      throw new ErrorWithContext("Condition already registered.", {
        addon: condition.getExtension().addonId,
        id: condition.getId(),
      });
    }

    this.registerCondition(extension, condition);
  }

  public registerCondition(
    extension: AnyConditionExtension,
    condition: ConditionDefinition,
  ): void {
    this.conditions.set(extension, condition);
  }

  public getComputable<TArgs extends unknown[], TReturnType>(
    ref: ComputableExtension,
  ): Computable<TArgs, TReturnType> {
    return (this.computables.get(ref) ?? new Computable()) as Computable<TArgs, TReturnType>;
  }

  public getAvailableProviders(): ProviderExtension[] {
    return Array.from(this.providers.keys());
  }

  public getAvailableConditions(
    loadoutEntry: LoadoutConfigEntry,
  ): AnyConditionExtension[] {
    return [
      ...this.getAvailableStandaloneConditions(),
      ...this.getAvailableCompanionConditionsFor(loadoutEntry),
    ];
  }

  public getAvailableStandaloneConditions(): StandaloneConditionExtension[] {
    return Array.from(this.conditions.keys())
      .filter((condition) => (condition instanceof StandaloneConditionExtension)) as StandaloneConditionExtension[];
  }

  public getAvailableCompanionConditionsFor(loadoutConfigEntry: LoadoutConfigEntry): CompanionConditionExtension[] {
    const primaryProvider = this.getProvider(loadoutConfigEntry.getPrimaryProvider());
    const secondaryProvider = this.getProvider(loadoutConfigEntry.getSecondaryProvider());

    const primaryProviderConditions = primaryProvider?.getCompanionConditions()?.getConditions() ?? new HashMap();
    const secondaryProviderConditions = secondaryProvider?.getCompanionConditions()?.getConditions() ?? new HashMap();

    const primaryProviderCompanionConditions = Array.from(primaryProviderConditions.values())
      .map((condition) => new CompanionConditionExtension(
        loadoutConfigEntry.getPrimaryProvider(),
        condition.getId(),
      ));

    const secondaryProviderCompanionConditions = Array.from(secondaryProviderConditions.values())
      .map((condition) => new CompanionConditionExtension(
        loadoutConfigEntry.getSecondaryProvider(),
        condition.getId(),
      ));

    const hashSet = new HashSet(primaryProviderCompanionConditions.concat(secondaryProviderCompanionConditions));
    return Array.from(hashSet.values());
  }

  public resolveProvider(extension: ProviderExtension): ProviderDefinition {
    return this.getProvider(extension) ?? this.getFallbackProvider();
  }

  public resolveCondition(loadoutEntry: LoadoutConfigEntry): ConditionDefinition {
    const companionConditions = new HashSet(this.getAvailableCompanionConditionsFor(loadoutEntry));

    if (
      loadoutEntry.getCondition() instanceof CompanionConditionExtension
      && !companionConditions.has(loadoutEntry.getCondition() as CompanionConditionExtension)
    ) {
      return this.getFallbackCondition();
    }

    return this.getCondition(loadoutEntry.getCondition()) ?? this.getFallbackCondition();
  }

  public getProvider(extension: ProviderExtension): ProviderDefinition | undefined {
    return this.providers.get(extension);
  }

  public getCondition(extension: AnyConditionExtension): ConditionDefinition | undefined {
    return this.conditions.get(extension);
  }

  public getFallbackProvider(): ProviderDefinition {
    const provider = this.providers.get(ExtensionService.FALLBACK_PROVIDER);
    if (provider === undefined) {
      throw new Error("Could not find the built-in fallback provider definition.");
    }

    return provider;
  }

  public getFallbackCondition(): ConditionDefinition {
    const conditionDefinition = this.conditions.get(ExtensionService.FALLBACK_CONDITION);
    if (conditionDefinition === undefined) {
      throw new Error("Could not find the built-in fallback condition definition.");
    }

    return conditionDefinition;
  }
}
