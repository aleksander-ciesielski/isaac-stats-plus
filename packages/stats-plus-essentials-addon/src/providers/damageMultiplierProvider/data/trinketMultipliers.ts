import { TrinketType } from "isaac-typescript-definitions";
import { aboveBaseDamageMultiplier } from "~/providers/damageMultiplierProvider/data/aboveBaseDamageMultiplier";

export const trinketMultipliers = new Map<TrinketType, (player: EntityPlayer) => number | undefined>([
  [TrinketType.CRACKED_CROWN, (player) => (
    aboveBaseDamageMultiplier(player.Damage, 1 + 0.2 * player.GetTrinketMultiplier(TrinketType.CRACKED_CROWN))
  )],
]);
