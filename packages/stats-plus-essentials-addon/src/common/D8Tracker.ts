import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type * as jsonModule from "json";
import { CollectibleType, ModCallback } from "isaac-typescript-definitions";

export class D8Tracker {
  private readonly preUseListener = this.onPreUse.bind(this);
  private readonly postUseListener = this.onPostUse.bind(this);

  private ignoreNextD8DueToD100Usage = false;
  private previousValue: number | undefined;

  public constructor(
    private readonly api: StatsPlusAPI.API,
    private readonly mod: Mod,
    private readonly json: typeof jsonModule,
    private readonly player: EntityPlayer,
    private readonly statType: StatsPlusAPI.ExtensionRef,
    private multiplier: number,
    private readonly updateListener: () => void,
  ) {
    this.mod.AddCallback(ModCallback.PRE_USE_ITEM, this.preUseListener);
    this.mod.AddCallback(ModCallback.POST_USE_ITEM, this.postUseListener);
  }

  public destroy(): void {
    this.mod.RemoveCallback(ModCallback.PRE_USE_ITEM, this.preUseListener);
    this.mod.RemoveCallback(ModCallback.POST_USE_ITEM, this.postUseListener);
  }

  public getMultiplier(): number {
    return this.multiplier;
  }

  private onPreUse(
    collectible: CollectibleType,
    rng: RNG,
    entityPlayer: EntityPlayer,
  ): undefined {
    try {
      if (this.player.Index !== entityPlayer.Index) {
        return;
      }

      if (collectible === CollectibleType.D100) {
        this.ignoreNextD8DueToD100Usage = true;
        return;
      }

      if (collectible === CollectibleType.D8 && !this.ignoreNextD8DueToD100Usage) {
        this.previousValue = this.getNumericStatValue(this.statType);
      }
    } catch (e) {
      Isaac.DebugString(`Error during D8 tracker pre-use callback: ${this.json.encode(e)}`);
    }
  }

  private onPostUse(
    collectible: CollectibleType,
    rng: RNG,
    entityPlayer: EntityPlayer,
  ): undefined {
    try {
      if (
        collectible !== CollectibleType.D8
        || this.player.Index !== entityPlayer.Index
      ) return;

      if (this.ignoreNextD8DueToD100Usage) {
        this.ignoreNextD8DueToD100Usage = false;
        return;
      }

      if (this.previousValue === undefined) {
        return;
      }

      this.multiplier *= this.getNumericStatValue(this.statType) / this.previousValue;
      this.updateListener();
    } catch (e) {
      Isaac.DebugString(`Error during D8 tracker post-use callback: ${this.json.encode(e)}`);
    }
  }

  private getNumericStatValue(stat: StatsPlusAPI.ExtensionRef): number {
    if (this.api.compareExtensionRefs(stat, this.api.stat.speed)) {
      return this.player.MoveSpeed;
    }

    if (this.api.compareExtensionRefs(stat, this.api.stat.tears)) {
      return 1 / this.player.MaxFireDelay;
    }

    if (this.api.compareExtensionRefs(stat, this.api.stat.damage)) {
      return this.player.Damage;
    }

    if (this.api.compareExtensionRefs(stat, this.api.stat.range)) {
      return this.player.TearRange;
    }

    throw new Error(`Unsupported stat type for D8; addon: "${stat.addon}", id: "${stat.id}".`);
  }
}
