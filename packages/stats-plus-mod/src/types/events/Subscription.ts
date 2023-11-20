import type { ValueOf } from "type-fest";
import type { EventList } from "~/types/events/EventList";

export interface Subscription<TEvent, TNotify extends ValueOf<EventList>> {
  event: TEvent;
  notify: TNotify;
  unsubscribe(): void;
}
