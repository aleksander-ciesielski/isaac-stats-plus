import type { ProviderStateEntry } from "~/entities/extension/provider/handle/state/ProviderStateEntry";
import type { StateEncoder } from "~/entities/extension/provider/handle/state/StateEncoder";
import type { ConfigService } from "~/services/config/ConfigService";
import type { ProviderExtension } from "~/entities/extension/provider/ProviderExtension";

export class ProviderStatePersistentEntry<TValue> implements ProviderStateEntry<TValue> {
  public constructor(
    private readonly providerExtension: ProviderExtension,
    private readonly key: string,
    private readonly stateEncoder: StateEncoder<TValue>,
    private readonly configService: ConfigService,
  ) {}

  public getValue(): TValue | undefined {
    const encoded = this.configService.getConfig().providerState.get(this.providerExtension, this.key);
    if (encoded === undefined) {
      return undefined;
    }

    return this.stateEncoder.decode(encoded);
  }

  public setValue(value: TValue): void {
    this.configService.updateConfig((config) => {
      config.providerState.set(this.providerExtension, this.key, this.stateEncoder.encode(value));
    });
  }
}
