import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { ProviderExtension } from "~/entities/extension/provider/ProviderExtension";
import type { ConfigService } from "~/services/config/ConfigService";
import type { StateEncoder } from "~/entities/extension/provider/handle/state/StateEncoder";
import type { ProviderStateEntry } from "~/entities/extension/provider/handle/state/ProviderStateEntry";
import {
  ProviderStatePersistentEntry,
} from "~/entities/extension/provider/handle/state/entry/ProviderStatePersistentEntry";
import { ProviderStateMemoryEntry } from "~/entities/extension/provider/handle/state/entry/ProviderStateMemoryEntry";

export class StateHandle<TValue> {
  private readonly value: ProviderStateEntry<TValue>;

  public constructor(
    private readonly providerExtension: ProviderExtension,
    private readonly definition: StatsPlusAPI.State<TValue>,
    private readonly key: string,
    private readonly stateEncoder: StateEncoder<TValue>,
    private readonly configService: ConfigService,
  ) {
    this.value = (this.definition.persistent === true)
      ? new ProviderStatePersistentEntry(this.providerExtension, this.key, this.stateEncoder, this.configService)
      : new ProviderStateMemoryEntry();

    if (this.value.getValue() === undefined) {
      this.value.setValue(this.definition.initial());
    }
  }

  public getExternalAPI(): StatsPlusAPI.StateHandle<TValue> {
    return {
      current: () => this.value.getValue() ?? this.definition.initial(),
      reset: () => this.value.setValue(this.definition.initial()),
      set: (value) => this.value.setValue(value),
    };
  }
}
