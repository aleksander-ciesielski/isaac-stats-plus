import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { ProviderDefinition } from "~/entities/extension/provider/ProviderDefinition";
import type { JsonSerializer } from "~/types/JsonSerializer";
import { ProviderState } from "~/entities/extension/provider/handle/state/ProviderState";
import { ConfigService } from "~/services/config/ConfigService";
import { Inject } from "~/app/ioc/decorators/Inject";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { DisplayStateHandle } from "~/entities/extension/provider/handle/state/DisplayStateHandle";
import { TimeProvider } from "~/services/renderer/TimeProvider";
import { StateEncoder } from "~/entities/extension/provider/handle/state/StateEncoder";
import { StateHandle } from "~/entities/extension/provider/handle/state/StateHandle";
import { InjectionToken } from "~/app/ioc/InjectionToken";
import { ErrorWithContext } from "~/errors/ErrorWithContext";

@Singleton()
export class StateResolver {
  public constructor(
    @Inject(TimeProvider) private readonly timeProvider: TimeProvider,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(InjectionToken.JsonSerializer) private readonly jsonSerializer: JsonSerializer,
  ) {}

  public resolveState<TDisplayValue, TStateList extends StatsPlusAPI.StateListDefinition>(
    provider: ProviderDefinition<
      TDisplayValue,
      StatsPlusAPI.ComputableListDefinition,
      StatsPlusAPI.CompanionConditionListDefinition,
      StatsPlusAPI.SettingListDefinition,
      TStateList
    >,
  ): ProviderState<TDisplayValue, TStateList> {
    const resolvedStateEntries = provider.getState().entries()
      .map(([key, state]) => [state, this.createStateHandle(key, state, provider)] as const);

    return new ProviderState<TDisplayValue, TStateList>(
      provider.getState(),
      new Map(resolvedStateEntries),
      this.createDisplayStateHandle(provider),
    );
  }

  private createStateHandle<TValue>(
    key: string,
    state: StatsPlusAPI.State<TValue>,
    provider: ProviderDefinition<TValue>,
  ): StateHandle<TValue> {
    return new StateHandle(
      provider.getExtension(),
      state,
      key,
      new StateEncoder(
        state.encoder ?? this.jsonSerializer,
        () => state.initial(),
      ),
      this.configService,
    );
  }

  private createDisplayStateHandle<TValue>(
    provider: ProviderDefinition<TValue>,
  ): DisplayStateHandle<TValue> | undefined {
    const state = provider.getState();
    if (state === undefined) {
      return;
    }

    const displayState = provider.getDisplaySettings().getDisplayState(state);
    if (displayState === undefined) {
      return;
    }

    const key = state.entries()
      .map(([key]) => key)
      .find((key) => (state.getByKey(key) === displayState));

    if (key === undefined) {
      throw new ErrorWithContext("Could not find a key for the provider display state.", {
        addonId: provider.getExtension().addonId,
        providerId: provider.getExtension().providerId,
      });
    }

    return new DisplayStateHandle(
      this.timeProvider,
      key,
      displayState,
      provider,
      new StateEncoder(
        displayState.encoder ?? this.jsonSerializer,
        () => displayState.initial(),
      ),
      this.configService,
    );
  }
}
