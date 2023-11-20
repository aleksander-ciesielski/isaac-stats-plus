import type { JsonSerializer } from "~/types/JsonSerializer";
import { Transient } from "~/app/ioc/decorators/Transient";
import { Inject } from "~/app/ioc/decorators/Inject";
import { ErrorWithContext } from "~/errors/ErrorWithContext";
import { APPLICATION_CONTAINER } from "~/app/APPLICATION_CONTAINER";
import { InjectionToken } from "~/app/ioc/InjectionToken";
import { tryCatch } from "~/util/functional/tryCatch";

@Transient()
export class Logger {
  // Set this to `true` to enable logging to the in-game console (~).
  private static readonly LOG_TO_CONSOLE_DEVELOPMENT_FLAG = false;

  private static readonly LOG_MESSAGE_PREFIX = "Stats+";
  private static readonly DEFAULT_NAMESPACE = "?";

  public static for(id: string): Logger {
    const logger = APPLICATION_CONTAINER.resolve(Logger);
    logger.setNamespace(id);

    return logger;
  }

  private nameSpace = Logger.DEFAULT_NAMESPACE;

  public constructor(
    @Inject(InjectionToken.IsaacAPI) private readonly isaac: typeof Isaac,
    @Inject(InjectionToken.JsonSerializer) private readonly jsonSerializer: JsonSerializer,
  ) {}

  public setNamespace(nameSpace: string): void {
    this.nameSpace = nameSpace;
  }

  public debug(message: string, context?: Record<keyof never, unknown>): void {
    this.logMessage(this.getFullMessage("DEBUG", message, context));
  }

  public info(message: string, context?: Record<keyof never, unknown>): void {
    this.logMessage(this.getFullMessage("INFO", message, context));
  }

  public warn(message: string, context?: Record<keyof never, unknown>): void {
    this.logMessage(this.getFullMessage("WARN", message, context));
  }

  public error(errorMessage: string, relatedError?: any, context?: Record<keyof never, unknown>): void {
    const message = (relatedError === undefined)
      ? errorMessage
      : new ErrorWithContext(errorMessage, context ?? {}, relatedError).getFullMessage(this.jsonSerializer);

    this.logMessage(this.getFullMessage("ERROR", message));
  }

  private getFullMessage(logLevel: string, baseMessage: string, context?: object): string {
    const messageWithoutContext = `(${logLevel}) [${Logger.LOG_MESSAGE_PREFIX}@${this.nameSpace}] ${baseMessage}`;

    if (context === undefined) {
      return messageWithoutContext;
    }

    const encodedContext = tryCatch(
      () => this.jsonSerializer.encode(context),
      () => "(context encode error)",
    );

    return `${messageWithoutContext} | ${encodedContext}`;
  }

  private logMessage(message: string): void {
    this.isaac.DebugString(message);

    if (Logger.LOG_TO_CONSOLE_DEVELOPMENT_FLAG) {
      // eslint-disable-next-line no-console
      console.log(message);
    }
  }
}
