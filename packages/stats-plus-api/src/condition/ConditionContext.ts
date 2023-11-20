import type { ExtensionRef } from "~/ExtensionRef";

export interface ConditionContext {
  player: EntityPlayer;
  playerIndex: number;
  stat: ExtensionRef;
  isActive(): boolean;
  setActive(active: boolean): void;
}
