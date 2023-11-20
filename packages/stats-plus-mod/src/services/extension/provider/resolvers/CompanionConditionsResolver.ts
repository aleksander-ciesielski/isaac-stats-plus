import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { ProviderDefinition } from "~/entities/extension/provider/ProviderDefinition";
import { ResolvedCompanionConditions } from "~/entities/extension/provider/handle/ResolvedCompanionConditions";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { CompanionConditionContext } from "~/entities/extension/condition/companion/CompanionConditionContext";

@Singleton()
export class CompanionConditionsResolver {
  public resolveCompanionConditions<TCompanionConditions extends StatsPlusAPI.CompanionConditionListDefinition>(
    provider: ProviderDefinition,
  ): ResolvedCompanionConditions<TCompanionConditions> {
    const companionConditionEntries = provider.getCompanionConditions().getConditions().entries();
    const resolvedCompanionConditionEntries = Array.from(companionConditionEntries).map(
      ([key, definition]) => [key, new CompanionConditionContext(definition.getId())],
    );

    return new ResolvedCompanionConditions(
      Object.fromEntries(resolvedCompanionConditionEntries),
    );
  }
}
