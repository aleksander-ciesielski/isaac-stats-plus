import { Hash } from "~/decorators/Hash";
import { Hashable } from "~/decorators/Hashable";

@Hashable()
export class Player {
  @Hash()
  public readonly index: number;

  public constructor(
    public readonly entityPlayer: EntityPlayer,
    index: number,
  ) {
    this.index = index;
  }

  public isMainPlayer(): boolean {
    return (this.index === 0);
  }
}
