import type { Provider } from "~/provider/Provider";
import type { Middleware } from "~/middleware/Middleware";
import type { StandaloneConditionDefinition } from "~/condition/StandaloneConditionDefinition";

export interface Addon {
  id: string;
  name: string;
  providers?: Provider<any, any, any, any>[];
  conditions?: StandaloneConditionDefinition[];
  middleware?: Middleware<unknown[], unknown>[];
}
