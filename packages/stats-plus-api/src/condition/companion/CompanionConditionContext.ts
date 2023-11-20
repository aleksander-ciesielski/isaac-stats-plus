export interface CompanionConditionContext {
  id: string;
  isActive(): boolean;
  setActive(active: boolean): void;
}
