const BASE_DAMAGE = 3.5;

// Effects that scale only the damage above 3.5 (applied last): turn the final damage back into a plain multiplier.
// shortcut: assumes each such effect is the only one, so Tainted Bethany + Cracked Crown is ~1% off; combine their factors if that matters.
export function aboveBaseDamageMultiplier(damage: number, factor: number): number | undefined {
  if (damage <= BASE_DAMAGE) {
    return undefined;
  }

  return damage / (BASE_DAMAGE + (damage - BASE_DAMAGE) / factor);
}
