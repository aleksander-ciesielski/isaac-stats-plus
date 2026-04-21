import { BracketStyle } from "~/entities/config/appearance/BracketStyle";

export interface AppearanceConfigCreateOptions {
  textOpacity: number;
  bracketStyle: BracketStyle;
  spacing: number;
  showProviderChanges: boolean;
}

export class AppearanceConfig {
  public static readonly MIN_TEXT_OPACITY = 0.1;
  public static readonly MAX_TEXT_OPACITY = 0.6;

  public static readonly AVAILABLE_BRACKET_STYLES = [
    BracketStyle.None,
    BracketStyle.Square,
    BracketStyle.Round,
    BracketStyle.Curly,
    BracketStyle.Angle,
  ] as const satisfies readonly BracketStyle[];

  public static readonly MIN_SPACING = 0;
  public static readonly MAX_SPACING = 10;

  private textOpacity: number;
  private bracketStyle: BracketStyle;
  private spacing: number;
  private showProviderChanges: boolean;

  public constructor(options: AppearanceConfigCreateOptions) {
    this.textOpacity = options.textOpacity;
    this.bracketStyle = options.bracketStyle;
    this.spacing = options.spacing;
    this.showProviderChanges = options.showProviderChanges;
  }

  public clone(): AppearanceConfig {
    return new AppearanceConfig({
      textOpacity: this.textOpacity,
      bracketStyle: this.bracketStyle,
      spacing: this.spacing,
      showProviderChanges: this.showProviderChanges,
    });
  }

  public getTextOpacity(): number {
    return this.textOpacity;
  }

  public getBracketStyle(): BracketStyle {
    return this.bracketStyle;
  }

  public getSpacing(): number {
    return this.spacing;
  }

  public showsProviderChanges(): boolean {
    return this.showProviderChanges;
  }

  public setTextOpacity(textOpacity: number): void {
    this.textOpacity = textOpacity;
  }

  public setBracketStyle(bracketStyle: BracketStyle): void {
    this.bracketStyle = bracketStyle;
  }

  public setSpacing(spacing: number): void {
    this.spacing = spacing;
  }

  public setShowingOfProviderChanges(showProviderChanges: boolean): void {
    this.showProviderChanges = showProviderChanges;
  }
}
