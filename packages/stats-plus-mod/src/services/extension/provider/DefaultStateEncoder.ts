import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import type { JsonSerializer } from "~/types/JsonSerializer";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { InjectionToken } from "~/app/ioc/InjectionToken";

@Singleton()
export class DefaultStateEncoder implements StatsPlusAPI.StateEncoder<unknown> {
  public constructor(
    @Inject(InjectionToken.JsonSerializer) private readonly jsonSerializer: JsonSerializer,
  ) {}

  public encode(decoded: unknown): string {
    return this.jsonSerializer.encode(decoded);
  }

  public decode(encoded: string): unknown {
    return this.jsonSerializer.decode(encoded);
  }
}
