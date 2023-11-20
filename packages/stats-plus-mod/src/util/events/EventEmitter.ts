import type { Subscription } from "~/types/events/Subscription";
import type { ValueOf } from "type-fest";
import type { EventList } from "~/types/events/EventList";
import type { Subject } from "~/types/events/Subject";

export class EventEmitter<TBroadcastedEvents extends EventList, TReceivedEvents extends EventList = TBroadcastedEvents>
implements Subject<TBroadcastedEvents, TReceivedEvents> {
  private readonly subscriptions = new Map<
    keyof TBroadcastedEvents | keyof TReceivedEvents,
    Set<ValueOf<TBroadcastedEvents> | ValueOf<TReceivedEvents>>
  >();

  public broadcast<TEvent extends keyof TBroadcastedEvents>(
    event: TEvent,
    ...args: Parameters<TBroadcastedEvents[TEvent]>
  ): void {
    this.subscriptions.get(event)?.forEach((notify) => notify(...args));
  }

  public subscribe<TEvent extends keyof TReceivedEvents>(
    event: TEvent,
    notify: TReceivedEvents[TEvent],
  ): Subscription<TEvent, TReceivedEvents[TEvent]> {
    const subscription = {
      notify,
      event,
      unsubscribe: () => this.unsubscribe(event, notify),
    };

    const subscriptions = this.subscriptions.get(event) ?? new Set();
    subscriptions.add(notify);
    this.subscriptions.set(event, subscriptions);

    return subscription;
  }

  public unsubscribe<TEvent extends keyof TReceivedEvents>(event: TEvent, notify: TReceivedEvents[TEvent]): void {
    this.subscriptions.get(event)?.delete(notify);
  }

  public unsubscribeAll(event: keyof TReceivedEvents): void {
    this.subscriptions.get(event)?.clear();
  }

  public asClient(): Subject<TReceivedEvents, TBroadcastedEvents> {
    return this as unknown as Subject<TReceivedEvents, TBroadcastedEvents>;
  }
}
