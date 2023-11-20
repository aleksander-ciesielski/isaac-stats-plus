import type { ConditionInstanceHandleContext } from "~/entities/player/condition/ConditionInstanceHandleContext";
import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { TimeProvider } from "~/services/renderer/TimeProvider";
import { Time } from "~/entities/Time";

export class ConditionInstanceHandle {
  private readonly cleanup: StatsPlusAPI.CleanupFunction | undefined;

  private active = false;
  private lastChange = Time.never();

  public constructor(
    private readonly timeProvider: TimeProvider,
    private readonly context: ConditionInstanceHandleContext,
  ) {
    this.cleanup = this.context.condition.mount(this.context.providers, this.getExternalAPI());
  }

  public unregister(): void {
    this.cleanup?.();
  }

  public isActive(): boolean {
    return this.active;
  }

  public getLastChange(): Time {
    return this.lastChange;
  }

  private getExternalAPI(): StatsPlusAPI.ConditionContext {
    return {
      player: this.context.player.entityPlayer,
      playerIndex: this.context.player.index,
      stat: this.context.stat.getExternalAPI(),
      isActive: (): boolean => this.isActive(),
      setActive: (active) => {
        if (active === this.isActive()) {
          return;
        }

        this.active = active;
        this.lastChange = this.timeProvider.getLastRenderTime();
      },
    };
  }
}
