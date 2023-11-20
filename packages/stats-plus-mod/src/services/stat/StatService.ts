import type { MetricValue } from "~/entities/metric/MetricValue";
import type { StatSlot } from "~/entities/stat/StatSlot";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { StatValueWatcher } from "~/services/stat/StatValueWatcher";

@Singleton()
export class StatService {
  public constructor(
    @Inject(StatValueWatcher) private readonly statValueWatcher: StatValueWatcher,
  ) {}

  public reload(): void {
    this.statValueWatcher.reload();
  }

  public getStatValue(slot: StatSlot): MetricValue<number> | undefined {
    return this.statValueWatcher.getStatValue(slot);
  }
}
