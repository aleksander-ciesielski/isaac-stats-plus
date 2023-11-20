import type { ProviderExtension } from "~/entities/extension/provider/ProviderExtension";
import type { HashMap } from "~/structures/HashMap";

export interface ProviderStateConfigOptions {
  providerState: HashMap<ProviderExtension, Record<keyof never, string>>;
}

export class ProviderStateConfig {
  private readonly providerState: HashMap<ProviderExtension, Record<keyof never, string>>;

  public constructor(options: ProviderStateConfigOptions) {
    this.providerState = options.providerState;
  }

  public clone(): ProviderStateConfig {
    return new ProviderStateConfig({
      providerState: this.providerState.clone(),
    });
  }

  public getProviderStateMap(): HashMap<ProviderExtension, Record<keyof never, string>> {
    return this.providerState.clone();
  }

  public get(provider: ProviderExtension, key: string): string | undefined {
    return this.providerState.get(provider)?.[key];
  }

  public set(
    provider: ProviderExtension,
    key: string,
    value: string,
  ): void {
    const state = this.providerState.get(provider) ?? {};
    state[key] = value;

    this.providerState.set(provider, state);
  }
}
