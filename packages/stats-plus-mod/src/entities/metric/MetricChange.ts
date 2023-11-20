import { Time } from "~/entities/Time";

export class MetricChange<TValue> {
  public static readonly ANIMATION_DURATION = Time.ms(4_000);

  private static readonly ACCUMULATION_DURATION = Time.ticks(120);

  public static empty<TValue>(currentTime: Time): MetricChange<TValue> {
    return new MetricChange<TValue>(
      undefined,
      undefined,
      false,
      currentTime.minus(MetricChange.ANIMATION_DURATION),
    );
  }

  public constructor(
    public readonly value: TValue | undefined,
    public readonly formattedValue: string | undefined,
    public readonly isPositive: boolean,
    public readonly lastUpdate: Time,
  ) {}

  public isAccumulating(time: Time): boolean {
    if (this.value === undefined) {
      return false;
    }

    return MetricChange.ACCUMULATION_DURATION.getTicks() > (time.getTicks() - this.lastUpdate.getTicks());
  }
}
