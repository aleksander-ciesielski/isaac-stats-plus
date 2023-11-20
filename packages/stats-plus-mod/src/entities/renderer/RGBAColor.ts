import type { Tuple } from "~/util/types/Tuple";

export class RGBAColor {
  public static fromArray(rgba: Tuple<4, number>): RGBAColor {
    const [r, g, b, a] = rgba;
    return new RGBAColor(r, g, b, a);
  }

  public constructor(
    public readonly red: number,
    public readonly green: number,
    public readonly blue: number,
    public readonly alpha: number,
  ) {}

  public asArray(): Tuple<4, number> {
    return [this.red, this.green, this.blue, this.alpha];
  }

  public withAlpha(alpha: number): RGBAColor {
    return new RGBAColor(this.red, this.green, this.blue, alpha);
  }
}
