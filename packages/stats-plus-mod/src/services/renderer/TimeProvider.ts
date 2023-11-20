import type { Easing } from "~/entities/interpolation/Interpolation";
import { ModCallback } from "isaac-typescript-definitions";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { ModCallbackService } from "~/services/menu/ModCallbackService";
import { Time } from "~/entities/Time";
import { InjectionToken } from "~/app/ioc/InjectionToken";
import { constrain } from "~/util/math/constrain";
import { Interpolation } from "~/entities/interpolation/Interpolation";

export interface InterpolationOptions<TInterpolatedValue extends number | number[]> {
  output: [start: TInterpolatedValue, end: TInterpolatedValue];
  easing: Easing;
  duration: Time;
  start?: Time;
}

@Singleton()
export class TimeProvider {
  private readonly onPostRenderCallback = this.onPostRender.bind(this);

  private lastRenderTime = Time.never();

  public constructor(
    @Inject(ModCallbackService) private readonly modCallbackService: ModCallbackService,
    @Inject(InjectionToken.GameAPI) private readonly game: Game,
    @Inject(InjectionToken.IsaacAPI) private readonly isaac: typeof Isaac,
  ) {}

  public getLastRenderTime(): Time {
    return this.lastRenderTime;
  }

  public reload(): void {
    this.modCallbackService.removeCallback(ModCallback.POST_RENDER, this.onPostRenderCallback);
    this.modCallbackService.addCallback(ModCallback.POST_RENDER, this.onPostRenderCallback);
  }

  public interpolate<TInterpolatedValue extends number | number[]>(
    options: InterpolationOptions<TInterpolatedValue>,
  ): Interpolation<TInterpolatedValue> {
    const [min, max] = options.output;
    const start = options.start ?? Time.never();

    const time = constrain(
      (this.getLastRenderTime().getTicks() - start.getTicks()) / options.duration.getTicks(),
      [0, 1],
    );

    const value = (Array.isArray(min) && Array.isArray(max))
      ? this.interpolateArray(min, max, options.easing(time))
      : this.interpolateScalar(min as number, max as number, options.easing(time));

    return new Interpolation(
      value as TInterpolatedValue,
      start,
      Time.ticks(start.getTicks() + options.duration.getTicks()),
    );
  }

  private interpolateArray(min: number[], max: number[], progress: number): number[] {
    if (min.length !== max.length) {
      throw new Error("Both arrays must have an equal length when interpolating.");
    }

    return min.map((_, i) => this.interpolateScalar(min[i]!, max[i]!, progress));
  }

  private interpolateScalar(min: number, max: number, progress: number): number {
    return min + (max - min) * progress;
  }

  private onPostRender(): void {
    if (this.game.IsPaused()) {
      return;
    }

    // 60 FPS hack
    const currentTicksInterpolated = this.game.GetFrameCount() + (1 - (this.isaac.GetFrameCount() % 2)) / 2;

    this.lastRenderTime = Time.ticks(currentTicksInterpolated);
  }
}
