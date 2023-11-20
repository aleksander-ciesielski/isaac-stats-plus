import type { EventList } from "~/types/events/EventList";
import type { Subscription } from "~/types/events/Subscription";

export interface Subject<
  TBroadcastedEvents extends EventList = EventList,
  TReceivedEvents extends EventList = EventList,
> {
  broadcast<TEvent extends keyof TBroadcastedEvents>(
    event: TEvent,
    ...args: Parameters<TBroadcastedEvents[TEvent]>
  ): void;
  subscribe<TEvent extends keyof TReceivedEvents>(
    event: TEvent,
    listener: TReceivedEvents[TEvent],
  ): Subscription<TEvent, TReceivedEvents[TEvent]>;
  unsubscribe<TEvent extends keyof TReceivedEvents>(
    event: TEvent,
    listener: TReceivedEvents[TEvent],
  ): void;
  unsubscribeAll(event: keyof TReceivedEvents): void;
  asClient(): Subject<TReceivedEvents, TBroadcastedEvents>;
}
