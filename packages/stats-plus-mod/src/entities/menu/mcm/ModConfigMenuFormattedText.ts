export class ModConfigMenuFormattedText {
  private static readonly MESSAGE_MAX_LENGTH = 40;
  private static readonly MESSAGE_ELLIPSIS = "...";

  private static getTextFormatted(text: string, decoration?: string): string {
    return (decoration === undefined)
      ? text
      : `${decoration}  ${text}  ${decoration}`;
  }

  private static trimText(text: string, maxLength: number): string {
    if (maxLength > text.length) {
      return text;
    }

    const trimmed = text.slice(0, maxLength - ModConfigMenuFormattedText.MESSAGE_ELLIPSIS.length);
    return `${trimmed}${ModConfigMenuFormattedText.MESSAGE_ELLIPSIS}`;
  }

  public constructor(
    private readonly text: string,
    private readonly decoration?: string | undefined,
  ) {}

  public getFormattedText(): string {
    return ModConfigMenuFormattedText.getTextFormatted(
      ModConfigMenuFormattedText.trimText(
        this.text,
        ModConfigMenuFormattedText.MESSAGE_MAX_LENGTH,
      ),
      this.decoration,
    );
  }
}
