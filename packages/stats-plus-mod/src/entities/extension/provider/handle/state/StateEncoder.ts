import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { Logger } from "~/Logger";

export class StateEncoder<TValue> {
  private readonly logger = Logger.for(StateEncoder.name);

  public constructor(
    private readonly encoder: StatsPlusAPI.StateEncoder<TValue>,
    private readonly createInitialValue: () => TValue,
  ) {}

  public encode(decoded: TValue): string {
    try {
      return this.encoder.encode(decoded);
    } catch (e) {
      this.logger.error("Failed to encode provider state.", e);
      throw e;
    }
  }

  public decode(encoded: string): TValue {
    try {
      return this.encoder.decode(encoded);
    } catch (e) {
      this.logger.error("Failed to decode provider state, returning initial state instead.", e);
      return this.createInitialValue();
    }
  }
}
