import type { Mocked } from "~/testing/types/Mocked";
import type { Subject } from "~/types/events/Subject";
import { mock } from "vitest-mock-extended";
import { EventEmitter } from "~/util/events/EventEmitter";

export interface ModMockWithEvents {
  mod: Mocked<Mod>;
  events: Subject;
}

export function createModMockWithEvents(): ModMockWithEvents {
  const mod = mock<Mod>();

  const events = new EventEmitter();
  mod.AddCallback.mockImplementation((event, ...args) => {
    const [callback] = args;
    events.subscribe(event, callback as (...args: unknown[]) => unknown);
  });

  mod.RemoveCallback.mockImplementation((event, callback) => {
    events.unsubscribe(event, callback);
  });

  return { mod, events };
}
