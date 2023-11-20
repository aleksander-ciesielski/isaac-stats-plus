export class CompanionConditionContext {
  private active = false;

  public constructor(
    public readonly id: string,
  ) {}

  public isActive(): boolean {
    return this.active;
  }

  public setActive(active: boolean): void {
    this.active = active;
  }
}
