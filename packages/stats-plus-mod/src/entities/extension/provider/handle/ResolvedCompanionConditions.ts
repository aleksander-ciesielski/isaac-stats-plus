import type * as StatsPlusAPI from "@isaac-stats-plus/api";

export class ResolvedCompanionConditions<TCompanionConditions extends StatsPlusAPI.CompanionConditionListDefinition> {
  private readonly byId: Record<string, StatsPlusAPI.CompanionConditionContext>;
  public constructor(
    private readonly byKey: StatsPlusAPI.ResolvedCompanionConditions<TCompanionConditions>,
  ) {
    this.byId = Object.fromEntries(
      Object.values(this.byKey).map((def) => [def.id, def]),
    );
  }

  public getExternalAPI(): StatsPlusAPI.ResolvedCompanionConditions<TCompanionConditions> {
    return this.byKey;
  }

  public isActive(companionConditionIdentifier: string): boolean {
    return this.byId[companionConditionIdentifier]?.isActive() ?? false;
  }
}
