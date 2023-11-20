import type { CallbackPriority } from "isaac-typescript-definitions";
import type { JsonSerializer } from "~/types/JsonSerializer";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { Logger } from "~/Logger";
import { ErrorWithContext } from "~/errors/ErrorWithContext";
import { InjectionToken } from "~/app/ioc/InjectionToken";

@Singleton()
export class ModCallbackService {
  private readonly logger = Logger.for(ModCallbackService.name);

  private readonly callbackToWrappedCallbackMapping = new Map<
    (...args: any[]) => unknown,
    (...args: any[]) => unknown
  >();

  public constructor(
    @Inject(InjectionToken.JsonSerializer) private readonly jsonSerializer: JsonSerializer,
    @Inject(InjectionToken.ModAPI) private readonly mod: Mod,
  ) {}

  public addCallback<TCallbackType extends keyof AddCallbackParameters>(
    callbackType: TCallbackType,
    ...callbackData: AddCallbackParameters[TCallbackType]
  ): void {
    this.logger.debug(
      "Adding a callback.",
      { callbackType },
    );

    const [callbackFn, ...callbackArgs] = callbackData;
    const wrappedCallbackFn = this.wrapCallbackWithErrorLogging<any[], unknown>(
      callbackType,
      callbackFn,
    );

    this.callbackToWrappedCallbackMapping.set(callbackFn, wrappedCallbackFn);
    this.mod.AddCallback<any>(callbackType, wrappedCallbackFn, ...callbackArgs);

    this.logger.debug(
      "Successfully added a callback.",
      { callbackType },
    );
  }

  public addPriorityCallback<TCallbackType extends keyof AddCallbackParameters>(
    callbackType: TCallbackType,
    priority: CallbackPriority,
    ...callbackData: AddCallbackParameters[TCallbackType]
  ): void {
    this.logger.debug(
      "Adding a priority callback.",
      { callbackType },
    );

    const [callbackFn, ...callbackArgs] = callbackData;
    const wrappedCallbackFn = this.wrapCallbackWithErrorLogging<any[], unknown>(
      callbackType,
      callbackFn,
    );

    this.callbackToWrappedCallbackMapping.set(callbackFn, wrappedCallbackFn);
    this.mod.AddPriorityCallback<any>(callbackType, priority, wrappedCallbackFn, ...callbackArgs);

    this.logger.debug(
      "Successfully added a priority callback.",
      { callbackType },
    );
  }

  public removeCallback<TCallbackType extends keyof AddCallbackParameters>(
    callbackType: TCallbackType,
    callbackFn: AddCallbackParameters[TCallbackType][0],
  ): void {
    this.logger.debug(
      "Removing a callback.",
      { callbackType },
    );

    const wrappedCallbackFn = this.callbackToWrappedCallbackMapping.get(callbackFn);
    if (wrappedCallbackFn === undefined) {
      return;
    }

    this.callbackToWrappedCallbackMapping.delete(callbackFn);
    this.mod.RemoveCallback(callbackType, wrappedCallbackFn);

    this.logger.debug(
      "Successfully removed a callback.",
      { callbackType },
    );
  }

  private wrapCallbackWithErrorLogging<TArgs extends unknown[], TReturnType>(
    callbackType: keyof AddCallbackParameters,
    callbackFn: (...args: TArgs) => TReturnType,
  ): (...args: TArgs) => TReturnType {
    return (...args: TArgs): TReturnType => {
      try {
        return callbackFn(...args);
      } catch (e: unknown) {
        const err = (e instanceof Error)
          ? e
          : new Error(this.jsonSerializer.encode(e));

        throw new ErrorWithContext(
          "Uncaught error in mod callback",
          { callbackType },
          err,
        );
      }
    };
  }
}
