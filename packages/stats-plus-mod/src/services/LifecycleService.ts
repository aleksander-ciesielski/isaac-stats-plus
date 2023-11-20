import type { Subject } from "~/types/events/Subject";
import type { LifecycleEvents } from "~/types/LifecycleEvents";
import { EventEmitter } from "~/util/events/EventEmitter";
import { Singleton } from "~/app/ioc/decorators/Singleton";

@Singleton()
export class LifecycleService {
  private readonly events = new EventEmitter<LifecycleEvents, never>();

  public reloadAll(): void {
    this.events.broadcast("reload");
  }

  public getEvents(): Subject<never, LifecycleEvents> {
    return this.events.asClient();
  }
}
