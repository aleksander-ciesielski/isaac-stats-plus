import type { ProviderExtension } from "~/entities/extension/provider/ProviderExtension";
import { Hashable } from "~/decorators/Hashable";
import { Hash } from "~/decorators/Hash";

@Hashable()
export class ComputableExtension {
  @Hash()
  public readonly providerExtension: ProviderExtension;

  @Hash()
  public readonly computableId: string;

  public constructor(providerExtension: ProviderExtension, computableId: string) {
    this.providerExtension = providerExtension;
    this.computableId = computableId;
  }
}
