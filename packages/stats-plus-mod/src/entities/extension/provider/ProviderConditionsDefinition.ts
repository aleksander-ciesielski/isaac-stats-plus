import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { ProviderExtension } from "~/entities/extension/provider/ProviderExtension";
import type { ModCallbackService } from "~/services/menu/ModCallbackService";
import { CompanionConditionExtension } from "~/entities/extension/condition/companion/CompanionConditionExtension";
import { CompanionConditionDefinition } from "~/entities/extension/condition/companion/CompanionConditionDefinition";
import { HashMap } from "~/structures/HashMap";

export class ProviderConditionsDefinition<TConditions extends StatsPlusAPI.CompanionConditionListDefinition> {
  public constructor(
    private readonly providerExtension: ProviderExtension,
    private readonly conditions: TConditions,
    private readonly modCallbackService: ModCallbackService,
  ) {}

  public getConditions(): HashMap<string, CompanionConditionDefinition> {
    const entries = Object.entries(this.conditions)
      .map(([conditionKey, definition]) => [conditionKey, new CompanionConditionDefinition(
        new CompanionConditionExtension(this.providerExtension, definition.id),
        definition,
        this.modCallbackService,
      )] as const);

    return new HashMap(entries);
  }
}
