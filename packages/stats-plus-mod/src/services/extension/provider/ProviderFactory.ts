import type { ProviderExtension } from "~/entities/extension/provider/ProviderExtension";
import type { Player } from "~/entities/player/Player";
import type { ProviderDefinition } from "~/entities/extension/provider/ProviderDefinition";
import type { StatExtension } from "~/entities/extension/stat/StatExtension";
import type { ProviderInstanceHandle } from "~/entities/extension/provider/handle/ProviderInstanceHandle";
import { ExtensionService } from "~/services/extension/ExtensionService";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { ComputablesResolver } from "~/services/extension/provider/resolvers/ComputablesResolver";
import { CompanionConditionsResolver } from "~/services/extension/provider/resolvers/CompanionConditionsResolver";
import { SettingsResolver } from "~/services/extension/provider/resolvers/SettingsResolver";
import { StateResolver } from "~/services/extension/provider/resolvers/StateResolver";
import { ProviderInstanceHandleContext } from "~/entities/player/provider/ProviderInstanceHandleContext";

@Singleton()
export class ProviderFactory {
  public constructor(
    @Inject(ExtensionService) private readonly extensionService: ExtensionService,
    @Inject(ComputablesResolver) private readonly computablesResolver: ComputablesResolver,
    @Inject(CompanionConditionsResolver) private readonly companionConditionsResolver: CompanionConditionsResolver,
    @Inject(SettingsResolver) private readonly settingsResolver: SettingsResolver,
    @Inject(StateResolver) private readonly stateResolver: StateResolver,
  ) {}

  public createProvider<TDisplayValue>(
    extension: ProviderExtension,
    stat: StatExtension,
    player: Player,
  ): ProviderInstanceHandle<TDisplayValue> {
    const provider = this.extensionService.resolveProvider(extension) as ProviderDefinition<TDisplayValue>;
    const context = new ProviderInstanceHandleContext({
      player,
      stat,
      computables: this.computablesResolver.resolveComputables(provider),
      conditions: this.companionConditionsResolver.resolveCompanionConditions(provider),
      settings: this.settingsResolver.resolveSettings(provider),
      state: this.stateResolver.resolveState(provider),
    });

    return provider.mount(context);
  }
}
