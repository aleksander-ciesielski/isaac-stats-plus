import type { ProviderExtension } from "~/entities/extension/provider/ProviderExtension";
import { Hashable } from "~/decorators/Hashable";
import { Hash } from "~/decorators/Hash";

@Hashable()
export class CompanionConditionExtension {
  @Hash()
  public readonly providerExtension: ProviderExtension;

  @Hash()
  public readonly id: string;

  public constructor(providerExtension: ProviderExtension, companionConditionId: string) {
    this.providerExtension = providerExtension;
    this.id = companionConditionId;
  }
}
