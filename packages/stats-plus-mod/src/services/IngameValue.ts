import type { Subject } from "~/types/events/Subject";
import type { ModCallbackService } from "~/services/menu/ModCallbackService";
import { ModCallback } from "isaac-typescript-definitions";
import { EventEmitter } from "~/util/events/EventEmitter";

type IngameValueEvents = {
  ready(): void;
};

export class IngameValue<TValue> {
  private readonly subject: Subject<IngameValueEvents, IngameValueEvents> = new EventEmitter();
  private readonly listener = this.onPostUpdate.bind(this);

  private value: TValue | undefined;
  private ready: boolean = false;

  public constructor(
    private readonly modCallbackService: ModCallbackService,
    private readonly getter: () => TValue,
  ) {
    this.modCallbackService.addCallback(ModCallback.POST_UPDATE, this.listener);
  }

  public get(callback: (value: TValue) => void): void {
    if (this.ready) {
      callback(this.value!);
      return;
    }

    this.subject.subscribe("ready", () => callback(this.value!));
  }

  private onPostUpdate(): void {
    this.value = this.getter();
    this.ready = true;
    this.subject.unsubscribeAll("ready");
    this.modCallbackService.removeCallback(ModCallback.POST_UPDATE, this.listener);
    this.subject.broadcast("ready");
  }
}
