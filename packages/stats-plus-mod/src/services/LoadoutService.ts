import type { Player } from "~/entities/player/Player";
import { ConfigService } from "~/services/config/ConfigService";
import { PlayerService } from "~/services/PlayerService";
import { ConditionFactory } from "~/services/extension/condition/ConditionFactory";
import { ProviderFactory } from "~/services/extension/provider/ProviderFactory";
import { StatSlot } from "~/entities/stat/StatSlot";
import { LoadoutEntry } from "~/entities/loadout/LoadoutEntry";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { CORE_STAT_EXTENSIONS } from "~/data/stat/CORE_STAT_EXTENSIONS";
import { HashMap } from "~/structures/HashMap";
import { ErrorWithContext } from "~/errors/ErrorWithContext";
import { LoadoutConfigEntry } from "~/entities/config/loadout/LoadoutConfigEntry";

@Singleton()
export class LoadoutService {
  private readonly entries = new HashMap<StatSlot, LoadoutEntry>();

  public constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(PlayerService) private readonly playerService: PlayerService,
    @Inject(ConditionFactory) private readonly conditionFactory: ConditionFactory,
    @Inject(ProviderFactory) private readonly providerFactory: ProviderFactory,
  ) {}

  public getEntry(slot: StatSlot): LoadoutEntry {
    const entry = this.entries.get(slot);
    if (entry === undefined) {
      throw new ErrorWithContext("No entry found for the given slot.", {
        playerIndex: slot.player.index,
        stat: slot.stat,
      });
    }

    return entry;
  }

  public reload(): void {
    Array.from(this.entries.values()).forEach((entry) => entry.unregister());
    this.entries.clear();

    const slots = this.playerService.getPlayers()
      .flatMap((player) => this.getSlotsForPlayer(player));

    slots.forEach((slot) => {
      try {
        this.entries.set(slot, this.createEntryFromSlot(slot));
      } catch (e: any) {
        throw new ErrorWithContext("Error during loadout entry creation.", {
          playerIndex: slot.player.index,
          stat: slot.stat,
        }, e);
      }
    });
  }

  private getSlotsForPlayer(player: Player): StatSlot[] {
    return CORE_STAT_EXTENSIONS.map(
      (statType) => new StatSlot(statType, player),
    );
  }

  private createEntryFromSlot(slot: StatSlot): LoadoutEntry {
    const loadout = this.configService.getConfig().loadout;

    const primaryProviderInstance = this.providerFactory.createProvider(
      loadout.getPrimaryProvider(slot.stat),
      slot.stat,
      slot.player,
    );

    const secondaryProviderInstance = this.providerFactory.createProvider(
      loadout.getSecondaryProvider(slot.stat),
      slot.stat,
      slot.player,
    );

    const condition = this.conditionFactory.createCondition(
      new LoadoutConfigEntry({
        stat: slot.stat,
        condition: loadout.getCondition(slot.stat),
        primaryProvider: primaryProviderInstance.getProvider().getExtension(),
        secondaryProvider: secondaryProviderInstance.getProvider().getExtension(),
      }),
      slot.player,
      slot.stat,
      primaryProviderInstance,
      secondaryProviderInstance,
    );

    return new LoadoutEntry(
      slot,
      condition,
      primaryProviderInstance,
      secondaryProviderInstance,
    );
  }
}
