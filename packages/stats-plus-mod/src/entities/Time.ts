export class Time {
  private static readonly GAME_FRAMERATE = 30;

  public static ms(ms: number): Time {
    return Time.ticks((ms / 1000) * Time.GAME_FRAMERATE);
  }

  public static ticks(ticks: number): Time {
    return new Time(ticks);
  }

  public static fromNullable(time: Time | undefined): Time {
    return time ?? Time.never();
  }

  public static never(): Time {
    return new Time(-Infinity);
  }

  public static max(...entries: (Time | undefined)[]): Time {
    const sorted = entries.toSorted(
      (a, b) => Time.fromNullable(b).getTicks() - Time.fromNullable(a).getTicks(),
    );

    return sorted[0] ?? Time.never();
  }

  private constructor(private readonly ticks: number) {}

  public getTicks(): number {
    return this.ticks;
  }

  public plus(that: Time): Time {
    return Time.ticks(this.getTicks() + that.getTicks());
  }

  public minus(that: Time): Time {
    return Time.ticks(this.getTicks() - that.getTicks());
  }
}
