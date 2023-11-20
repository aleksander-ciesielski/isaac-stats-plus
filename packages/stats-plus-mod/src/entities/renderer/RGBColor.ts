import type { Tuple } from "~/util/types/Tuple";
import { RGBAColor } from "~/entities/renderer/RGBAColor";

export class RGBColor {
  public constructor(
    public readonly red: number,
    public readonly green: number,
    public readonly blue: number,
  ) {}

  public asArray(): Tuple<3, number> {
    return [this.red, this.green, this.blue];
  }

  public asRGBA(opacity: number): RGBAColor {
    return new RGBAColor(this.red, this.green, this.blue, opacity);
  }
}
