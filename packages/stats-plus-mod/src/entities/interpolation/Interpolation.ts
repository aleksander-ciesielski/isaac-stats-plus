import type { Time } from "~/entities/Time";

export type Easing = (progress: number) => number;

export class Interpolation<TInterpolatedValue extends number | number[]> {
  public static easeOut: Easing = (progress) => (1 - (1 - progress) ** 3);
  public static linear: Easing = (progress) => progress;

  public constructor(
    private readonly value: TInterpolatedValue,
    private readonly startTime: Time,
    private readonly finishTime: Time,
  ) {}

  public getValue(): TInterpolatedValue {
    return this.value;
  }

  public getStartTime(): Time {
    return this.startTime;
  }

  public getFinishTime(): Time {
    return this.finishTime;
  }
}
