import { TrinketType } from "isaac-typescript-definitions";

export const trinketMultipliers = new Map<TrinketType, (player: EntityPlayer) => number | undefined>([
  [TrinketType.CRACKED_CROWN, () => 1.2],
]);
