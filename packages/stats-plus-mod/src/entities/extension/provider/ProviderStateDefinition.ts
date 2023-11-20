import type * as StatsPlusAPI from "@isaac-stats-plus/api";

export class ProviderStateDefinition<TState extends StatsPlusAPI.StateListDefinition> {
  public constructor(private readonly stateList: TState) {}

  public entries(): [string, StatsPlusAPI.State<any>][] {
    return Object.entries(this.stateList ?? {});
  }

  public getExternalAPI(): TState {
    return this.stateList;
  }

  public getByKey<TKey extends keyof TState>(key: TKey): TState[TKey] | undefined {
    return this.stateList?.[key] as TState[TKey] | undefined;
  }
}
