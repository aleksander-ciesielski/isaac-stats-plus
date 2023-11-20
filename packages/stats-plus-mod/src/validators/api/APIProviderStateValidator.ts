import type { Unvalidated } from "~/types/validation/Unvalidated";
import type * as StatsPlusAPI from "@isaac-stats-plus/api";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { ErrorWithContext } from "~/errors/ErrorWithContext";

@Singleton()
export class APIProviderStateValidator {
  public validateState<TState extends StatsPlusAPI.StateListDefinition>(
    state: Unvalidated<TState | undefined>,
  ): TState | undefined {
    if (state === undefined) {
      return undefined;
    }

    if (typeof state !== "object" || state === null) {
      throw new ErrorWithContext("Expected provider state (`.state`) to be an object.", {
        state,
        stateType: typeof state,
      });
    }

    return Object.fromEntries(
      Object.entries(state).map(([key, entry]) => [key, this.validateStateEntry(entry)]),
    ) as TState;
  }

  private validateStateEntry<TValue>(
    stateEntry: Unvalidated<StatsPlusAPI.State<TValue>>,
  ): StatsPlusAPI.State<TValue> {
    const persistent = this.validatePersistent(stateEntry?.persistent as Unvalidated<boolean>);

    return {
      persistent,
      encoder: this.validateEncoder(stateEntry?.encoder, persistent ?? false),
      initial: this.validateInitialValueGetter(stateEntry?.initial),
    };
  }

  private validatePersistent(persistent: Unvalidated<boolean | undefined>): boolean | undefined {
    if (persistent === undefined) {
      return undefined;
    }

    if (typeof persistent !== "boolean") {
      throw new ErrorWithContext("Expected provider state persistency (`.persistent`) to be a boolean.", {
        persistent,
        persistentType: typeof persistent,
      });
    }

    return persistent;
  }

  private validateEncoder<TValue>(
    stateEncoder: Unvalidated<StatsPlusAPI.StateEncoder<TValue> | undefined>,
    isPersistent: boolean,
  ): StatsPlusAPI.StateEncoder<TValue> | undefined {
    if (stateEncoder === undefined) {
      return undefined;
    }

    if (!isPersistent) {
      throw new Error("Expected state encoder (`.encoder`) to not be defined for non-persistent state entries.");
    }

    return {
      encode: this.validateEncodeFunction(stateEncoder?.encode),
      decode: this.validateDecodeFunction(stateEncoder?.decode),
    };
  }

  private validateEncodeFunction<TValue>(
    encode: Unvalidated<StatsPlusAPI.StateEncoder<TValue>["encode"]>,
  ): StatsPlusAPI.StateEncoder<TValue>["encode"] {
    if (typeof encode !== "function") {
      throw new ErrorWithContext("Expected state encoder encode function (`.encode`) to be a function.", {
        encode,
        encodeType: typeof encode,
      });
    }

    return encode as StatsPlusAPI.StateEncoder<TValue>["encode"];
  }

  private validateDecodeFunction<TValue>(
    decode: Unvalidated<StatsPlusAPI.StateEncoder<TValue>["decode"]>,
  ): StatsPlusAPI.StateEncoder<TValue>["decode"] {
    if (typeof decode !== "function") {
      throw new ErrorWithContext("Expected state encoder decode function (`.decode`) to be a function.", {
        decode,
        decodeType: typeof decode,
      });
    }

    return decode as StatsPlusAPI.StateEncoder<TValue>["decode"];
  }

  private validateInitialValueGetter<TValue>(
    initial: Unvalidated<StatsPlusAPI.State<TValue>["initial"]>,
  ): StatsPlusAPI.State<TValue>["initial"] {
    if (typeof initial !== "function") {
      throw new ErrorWithContext("Expected state initial value getter (`.initial`) to be a function.", {
        initialValueGetterType: typeof initial,
      });
    }

    return initial as StatsPlusAPI.State<TValue>["initial"];
  }
}
