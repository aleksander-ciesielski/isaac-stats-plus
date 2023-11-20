import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { ConditionDefinition } from "~/types/extension/condition/ConditionDefinition";
import type { ProviderInstanceHandle } from "~/entities/extension/provider/handle/ProviderInstanceHandle";
import type { CompanionConditionExtension } from "~/entities/extension/condition/companion/CompanionConditionExtension";
import type { ModCallbackService } from "~/services/menu/ModCallbackService";
import { ModCallback } from "isaac-typescript-definitions";
import { StructuralComparator } from "~/services/StructuralComparator";

export class CompanionConditionDefinition implements ConditionDefinition {
  private readonly structuralComparator = new StructuralComparator();

  public constructor(
    private readonly extension: CompanionConditionExtension,
    private readonly condition: StatsPlusAPI.CompanionConditionDefinition,
    private readonly modCallbackService: ModCallbackService,
  ) {}

  public getId(): string {
    return this.condition.id;
  }

  public getName(): string {
    return this.condition.name;
  }

  public getDescription(): string {
    return this.condition.description;
  }

  public getExtension(): CompanionConditionExtension {
    return this.extension;
  }

  public mount(
    providerInstances: ProviderInstanceHandle[],
    context: StatsPlusAPI.ConditionContext,
  ): StatsPlusAPI.CleanupFunction | undefined {
    const providerHandle = providerInstances.find(
      (providerInstance) => this.structuralComparator.compare(
        providerInstance.getProvider().getExtension(),
        this.extension.providerExtension,
      ),
    );

    if (providerHandle === undefined) {
      throw new Error("No matching provider instance handle found for the given companion condition.");
    }

    const listener = this.onPostUpdate.bind(this, providerHandle, context);

    this.modCallbackService.addCallback(ModCallback.POST_UPDATE, listener);
    return () => this.modCallbackService.removeCallback(ModCallback.POST_UPDATE, listener);
  }

  private onPostUpdate(
    providerHandle: ProviderInstanceHandle,
    context: StatsPlusAPI.ConditionContext,
  ): void {
    context.setActive(providerHandle.isCompanionConditionActive(this.condition.id));
  }
}
