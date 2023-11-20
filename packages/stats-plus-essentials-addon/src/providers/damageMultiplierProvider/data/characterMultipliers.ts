import { CollectibleType, PlayerType } from "isaac-typescript-definitions";

export const characterMultipliers = new Map<PlayerType, (player: EntityPlayer) => number | undefined>([
  [PlayerType.CAIN, () => 1.2],
  [PlayerType.JUDAS, () => 1.35],
  [PlayerType.BLUE_BABY, () => 1.05],
  [PlayerType.EVE, (player) => (
    player.GetEffects().HasCollectibleEffect(CollectibleType.WHORE_OF_BABYLON)
      ? undefined
      : 0.75
  )],
  [PlayerType.AZAZEL, () => 1.5],
  [PlayerType.LAZARUS_2, () => 1.4],
  [PlayerType.DARK_JUDAS, () => 2],
  [PlayerType.KEEPER, () => 1.2],
  [PlayerType.FORGOTTEN, () => 1.5],
  [PlayerType.MAGDALENE_B, () => 0.75],
  [PlayerType.EVE_B, () => 1.2],
  [PlayerType.AZAZEL_B, () => 1.5],
  [PlayerType.LOST_B, () => 1.3],
  [PlayerType.FORGOTTEN_B, () => 1.5],
  [PlayerType.LAZARUS_2_B, () => 1.5],
]);
