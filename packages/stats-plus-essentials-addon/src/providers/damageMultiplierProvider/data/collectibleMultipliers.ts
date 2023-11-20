import { CollectibleType } from "isaac-typescript-definitions";

export const collectibleMultipliers = new Map<CollectibleType, (player: EntityPlayer) => number | undefined>([
  [CollectibleType.MEGA_MUSH, (player) => (
    player.GetEffects().HasCollectibleEffect(CollectibleType.MEGA_MUSH)
      ? 4
      : undefined
  )],
  [CollectibleType.CRICKETS_HEAD, () => 1.5],
  [CollectibleType.MAGIC_MUSHROOM, (player) => (
    player.HasCollectible(CollectibleType.CRICKETS_HEAD)
      ? undefined
      : 1.5
  )],
  [CollectibleType.BLOOD_OF_THE_MARTYR, (player) => {
    if (
      player.HasCollectible(CollectibleType.CRICKETS_HEAD)
      || player.GetEffects().HasCollectibleEffect(CollectibleType.MAGIC_MUSHROOM)
    ) {
      return;
    }

    return player.GetEffects().HasCollectibleEffect(CollectibleType.BOOK_OF_BELIAL)
      ? 1.5
      : undefined;
  }],
  [CollectibleType.POLYPHEMUS, () => 2],
  [CollectibleType.SACRED_HEART, () => 2.3],
  [CollectibleType.EVES_MASCARA, () => 2],
  [CollectibleType.ALMOND_MILK, () => 0.33],
  [CollectibleType.SOY_MILK, (player) => (
    player.HasCollectible(CollectibleType.ALMOND_MILK)
      ? undefined
      : 0.2
  )],
  [CollectibleType.CROWN_OF_LIGHT, (player) => (
    player.GetEffects().HasCollectibleEffect(CollectibleType.CROWN_OF_LIGHT)
      ? 2
      : undefined
  )],
  [CollectibleType.IMMACULATE_HEART, () => 1.2],
  [CollectibleType.ODD_MUSHROOM_THIN, () => 0.9],
  [CollectibleType.TWENTY_TWENTY, () => 0.8],
  [CollectibleType.BRIMSTONE, (player) => {
    if (player.HasCollectible(CollectibleType.HAEMOLACRIA)) {
      return undefined;
    }

    if (player.GetCollectibleNum(CollectibleType.BRIMSTONE) === 1) {
      return player.HasCollectible(CollectibleType.TECHNOLOGY)
        ? 1.5
        : undefined;
    }

    return (player.HasCollectible(CollectibleType.TECHNOLOGY) && player.HasCollectible(CollectibleType.TECH_X))
      ? 1.8
      : 1.2;
  }],
]);
