import type { Container } from "~/app/ioc/Container";
import type { JsonSerializer } from "~/types/JsonSerializer";
import * as json from "json";
import { InjectionToken } from "~/app/ioc/InjectionToken";
import { singleton } from "~/app/ioc/resolution/singleton";
import { createMod } from "~/app/createMod";
import { IngameValue } from "~/services/IngameValue";
import { ModCallbackService } from "~/services/menu/ModCallbackService";

// For some reason, TSTL won't make it work without this pointless adapter.
const jsonSerializerAdapter: JsonSerializer = {
  encode<TData = unknown>(decoded: TData): string {
    return json.encode(decoded);
  },
  decode<TData = unknown>(encoded: string): TData {
    return json.decode(encoded) as TData;
  },
};

export const injectionTokenEntityMapping = {
  [InjectionToken.ModConfigMenu]: singleton((container) => new IngameValue(
    container.resolve(ModCallbackService),
    () => ModConfigMenu,
  )),
  [InjectionToken.IsaacAPI]: singleton(() => Isaac),
  [InjectionToken.GameAPI]: singleton(() => Game()),
  [InjectionToken.ModAPI]: singleton(() => createMod()),
  [InjectionToken.OptionsAPI]: singleton(() => Options),
  [InjectionToken.JsonSerializer]: singleton(() => jsonSerializerAdapter),
} as const satisfies Record<InjectionToken, (container: Container) => unknown>;
