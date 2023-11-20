import type { SettingEncoder } from "~/types/extension/SettingEncoder";
import type { ProviderToggleSetting } from "~/entities/extension/provider/settings/ProviderToggleSetting";
import { Singleton } from "~/app/ioc/decorators/Singleton";

@Singleton()
export class ToggleSettingEncoder implements SettingEncoder<ProviderToggleSetting, string> {
  public encode(decoded: boolean): string {
    return decoded.toString();
  }

  public decode(encoded: string): boolean {
    return (encoded === "true");
  }
}
