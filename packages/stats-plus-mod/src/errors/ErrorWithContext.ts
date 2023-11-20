import type { JsonSerializer } from "~/types/JsonSerializer";
import { tryCatch } from "~/util/functional/tryCatch";

export class ErrorWithContext extends Error {
  public constructor(
    message: string,
    public readonly context: Record<keyof never, unknown>,
    public readonly relatedError?: Error | undefined,
  ) {
    super(message);
  }

  public getFullMessage(jsonSerializer: JsonSerializer): string {
    const encodedContext = tryCatch(
      () => jsonSerializer.encode(this.context),
      () => "(context encode error)",
    );

    if (this.relatedError === undefined) {
      return `${this.message} (${encodedContext})`;
    }

    const relatedErrorMessage = (this.relatedError instanceof ErrorWithContext)
      ? this.relatedError.getFullMessage(jsonSerializer)
      : this.relatedError.message ?? this.relatedError.toString();

    return `${this.message} (${encodedContext}) -> ${relatedErrorMessage}`;
  }
}
