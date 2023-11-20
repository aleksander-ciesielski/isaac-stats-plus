import { vi } from "vitest";
import { EventEmitter } from "~/util/events/EventEmitter";

type Events = {
  A(param: number): void;
  B(param: number): void;
};

describe("EventEmitter", () => {
  let eventEmitter: EventEmitter<Events>;
  beforeEach(() => {
    eventEmitter = new EventEmitter();
  });

  describe("asClient", () => {
    it("returns itself (used only to swap TypeScript type arguments).", () => {
      expect(eventEmitter.asClient()).toBe(eventEmitter);
    });
  });

  describe("broadcast", () => {
    it("calls all subscribers of the broadcasted event.", () => {
      const listener = vi.fn();
      eventEmitter.subscribe("A", listener);
      eventEmitter.broadcast("A", 42);

      expect(listener).toHaveBeenCalledWith(42);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("does not call subscribers of other events.", () => {
      const listener = vi.fn();
      eventEmitter.subscribe("A", listener);
      eventEmitter.broadcast("B", 42);

      expect(listener).toHaveBeenCalledTimes(0);
    });
  });

  describe("subscribe", () => {
    it("returns an object containing 'event' field equal to the subscribed event.", () => {
      const subscription = eventEmitter.subscribe("A", vi.fn());

      expect(subscription.event).toBe("A");
    });

    it("returns an object containing 'notify' function that executes the listener.", () => {
      const listener = vi.fn();
      const subscription = eventEmitter.subscribe("A", listener);

      subscription.notify(123);

      expect(listener).toHaveBeenCalledWith(123);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("returns an object containing 'unsubscribe' function that unregisters the listener.", () => {
      const listener = vi.fn();
      const subscription = eventEmitter.subscribe("A", listener);

      subscription.unsubscribe();
      eventEmitter.broadcast("A", 42);

      expect(listener).toHaveBeenCalledTimes(0);
    });
  });

  describe("unsubscribeAll", () => {
    it("unregisters all listeners of the given event.", () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      eventEmitter.subscribe("A", listener1);
      eventEmitter.subscribe("A", listener2);
      eventEmitter.unsubscribeAll("A");
      eventEmitter.broadcast("A", 42);

      expect(listener1).toHaveBeenCalledTimes(0);
      expect(listener2).toHaveBeenCalledTimes(0);
    });

    it("does not affect listeners of other events.", () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      eventEmitter.subscribe("B", listener1);
      eventEmitter.subscribe("B", listener2);
      eventEmitter.unsubscribeAll("A");
      eventEmitter.broadcast("B", 42);

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });
  });
});
