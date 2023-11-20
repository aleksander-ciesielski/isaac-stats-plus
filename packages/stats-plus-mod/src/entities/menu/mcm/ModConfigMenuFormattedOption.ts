import { ModConfigMenuFormattedText } from "~/entities/menu/mcm/ModConfigMenuFormattedText";

export class ModConfigMenuFormattedOption {
  private readonly formattedText: ModConfigMenuFormattedText;

  public constructor(
    private readonly name: string,
    private readonly option: string,
    private readonly decoration?: string | undefined,
  ) {
    this.formattedText = new ModConfigMenuFormattedText(
      `${this.name}: ${this.option}`,
      this.decoration,
    );
  }

  public getFormattedText(): string {
    return this.formattedText.getFormattedText();
  }
}
