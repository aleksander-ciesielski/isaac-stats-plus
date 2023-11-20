import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { DisplayStateHandle } from "~/entities/extension/provider/handle/state/DisplayStateHandle";
import type { ProviderStateDefinition } from "~/entities/extension/provider/ProviderStateDefinition";
import type { StateHandle } from "~/entities/extension/provider/handle/state/StateHandle";
import { ErrorWithContext } from "~/errors/ErrorWithContext";

export class ProviderState<TDisplayValue, TStateList extends StatsPlusAPI.StateListDefinition> {
  public constructor(
    private readonly definition: ProviderStateDefinition<TStateList>,
    private readonly handles: Map<StatsPlusAPI.State<unknown>, StateHandle<unknown>>,
    private readonly displayStateHandle?: DisplayStateHandle<TDisplayValue>,
  ) {}

  public getExternalAPI(): StatsPlusAPI.ResolvedState<TStateList> {
    const entries = this.definition.entries().map(([stateIdentifier, state]) => {
      if (stateIdentifier === this.displayStateHandle?.getKey()) {
        return [stateIdentifier, this.getDisplayStateHandle()!.getExternalAPI()];
      }

      const handle = this.handles.get(state);
      if (handle === undefined) {
        throw new ErrorWithContext("Could not find an internal state handle for the provider state.", {
          stateIdentifier,
        });
      }

      return [stateIdentifier, handle.getExternalAPI()];
    });

    return Object.fromEntries(entries);
  }

  public getDisplayStateHandle(): DisplayStateHandle<TDisplayValue> | undefined {
    return this.displayStateHandle;
  }
}
