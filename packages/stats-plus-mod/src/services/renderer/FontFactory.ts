import { Singleton } from "~/app/ioc/decorators/Singleton";

@Singleton()
export class FontFactory {
  public create(filePath: string): Font {
    const font = Font();
    font.Load(filePath);

    return font;
  }
}
