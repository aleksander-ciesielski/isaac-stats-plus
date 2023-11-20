import type { ProviderInstanceHandle } from "~/entities/extension/provider/handle/ProviderInstanceHandle";
import type { Player } from "~/entities/player/Player";
import type { LoadoutConfigEntry } from "~/entities/config/loadout/LoadoutConfigEntry";
import type { StatExtension } from "~/entities/extension/stat/StatExtension";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { ExtensionService } from "~/services/extension/ExtensionService";
import { TimeProvider } from "~/services/renderer/TimeProvider";
import { ConditionInstanceHandle } from "~/entities/extension/condition/handle/ConditionInstanceHandle";
import { ConditionInstanceHandleContext } from "~/entities/player/condition/ConditionInstanceHandleContext";

@Singleton()
export class ConditionFactory {
  public constructor(
    @Inject(TimeProvider) private readonly timeProvider: TimeProvider,
    @Inject(ExtensionService) private readonly extensionService: ExtensionService,
  ) {}

  public createCondition(
    loadoutConfigEntry: LoadoutConfigEntry,
    player: Player,
    stat: StatExtension,
    primaryProvider: ProviderInstanceHandle,
    secondaryProvider: ProviderInstanceHandle,
  ): ConditionInstanceHandle {
    const context = new ConditionInstanceHandleContext({
      player,
      stat,
      providers: [primaryProvider, secondaryProvider],
      condition: this.extensionService.resolveCondition(loadoutConfigEntry),
    });

    return new ConditionInstanceHandle(this.timeProvider, context);
  }
}
