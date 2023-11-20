import type { RGBAColor } from "~/entities/renderer/RGBAColor";
import { Singleton } from "~/app/ioc/decorators/Singleton";

@Singleton()
export class ColorFactory {
  public createFontColor(color: RGBAColor): KColor {
    return KColor(color.red, color.green, color.blue, color.alpha);
  }
}
