import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { ConditionDefinition } from "~/types/extension/condition/ConditionDefinition";
import type { ProviderInstanceHandle } from "~/entities/extension/provider/handle/ProviderInstanceHandle";
import { StandaloneConditionExtension } from "~/entities/extension/condition/standalone/StandaloneConditionExtension";
import { Logger } from "~/Logger";

export class StandaloneConditionDefinition implements ConditionDefinition {
  private readonly logger = Logger.for(StandaloneConditionDefinition.name);

  private readonly extension: StandaloneConditionExtension;

  public constructor(
    private readonly addonId: string,
    private readonly standaloneCondition: StatsPlusAPI.StandaloneConditionDefinition,
  ) {
    this.extension = new StandaloneConditionExtension({
      addon: this.addonId,
      id: this.standaloneCondition.id,
    });
  }

  public getId(): string {
    return this.standaloneCondition.id;
  }

  public getName(): string {
    return this.standaloneCondition.name;
  }

  public getDescription(): string {
    return this.standaloneCondition.description;
  }

  public getExtension(): StandaloneConditionExtension {
    return this.extension;
  }

  public mount(
    providers: ProviderInstanceHandle[],
    context: StatsPlusAPI.ConditionContext,
  ): StatsPlusAPI.CleanupFunction | undefined {
    try {
      return this.standaloneCondition.mount(context);
    } catch (e) {
      this.logger.error("Error during standalone condition mount", e, {
        addonId: this.addonId,
        conditionId: this.standaloneCondition.id,
      });

      return undefined;
    }
  }
}
