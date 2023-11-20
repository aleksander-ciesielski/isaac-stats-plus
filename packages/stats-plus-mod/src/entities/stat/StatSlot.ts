import type { Player } from "~/entities/player/Player";
import type { StatExtension } from "~/entities/extension/stat/StatExtension";
import { Hashable } from "~/decorators/Hashable";
import { Hash } from "~/decorators/Hash";

@Hashable()
export class StatSlot {
  @Hash()
  public readonly stat: StatExtension;

  @Hash()
  public readonly player: Player;

  public constructor(stat: StatExtension, player: Player) {
    this.stat = stat;
    this.player = player;
  }
}
