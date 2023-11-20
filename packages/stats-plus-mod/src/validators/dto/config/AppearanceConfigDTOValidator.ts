import type { Unvalidated } from "~/types/validation/Unvalidated";
import type { AppearanceConfigDTO } from "~/types/config/dto/appearance/AppearanceConfigDTO";
import type { BracketStyle } from "~/entities/config/appearance/BracketStyle";
import { Logger } from "~/Logger";
import { Config } from "~/entities/config/Config";
import { AppearanceConfig } from "~/entities/config/appearance/AppearanceConfig";
import { Singleton } from "~/app/ioc/decorators/Singleton";

@Singleton()
export class AppearanceConfigDTOValidator {
  private readonly logger = Logger.for(AppearanceConfigDTOValidator.name);

  public validate(appearance: Unvalidated<AppearanceConfigDTO>): AppearanceConfigDTO {
    if (appearance === undefined) {
      return Config.DEFAULT_CONFIG.appearance;
    }

    return {
      textOpacity: this.getValidatedTextOpacity(appearance.textOpacity as Unvalidated<number>),
      bracketStyle: this.getValidatedBracketStyle(appearance.bracketStyle as Unvalidated<BracketStyle>),
      spacing: this.getValidatedSpacing(appearance.spacing as Unvalidated<number>),
      showProviderChanges: this.getValidatedShowProviderChanges(appearance.showProviderChanges as Unvalidated<boolean>),
      useShaderColorFix: this.getValidatedUseShaderColorFix(appearance.useShaderColorFix as Unvalidated<boolean>),
    };
  }

  private getValidatedTextOpacity(textOpacity: Unvalidated<number>): number {
    if (typeof textOpacity !== "number") {
      this.logger.warn("Expected text opacity to be a number.", { textOpacity, type: typeof textOpacity });
      return Config.DEFAULT_CONFIG.appearance.textOpacity;
    }

    if (textOpacity > AppearanceConfig.MAX_TEXT_OPACITY) {
      this.logger.warn(`Expected text opacity to be less than ${AppearanceConfig.MAX_TEXT_OPACITY}.`, { textOpacity });
      return Config.DEFAULT_CONFIG.appearance.textOpacity;
    }

    if (AppearanceConfig.MIN_TEXT_OPACITY > textOpacity) {
      this.logger.warn(
        `Expected text opacity to be greater than ${AppearanceConfig.MIN_TEXT_OPACITY}.`,
        { textOpacity },
      );

      return Config.DEFAULT_CONFIG.appearance.textOpacity;
    }

    return textOpacity;
  }

  private getValidatedBracketStyle(bracketStyle: Unvalidated<BracketStyle>): BracketStyle {
    if (bracketStyle === undefined || !AppearanceConfig.AVAILABLE_BRACKET_STYLES.includes(bracketStyle)) {
      this.logger.warn(
        "Expected bracket style to be a valid enum value.",
        { bracketStyle, type: typeof bracketStyle, availableBracketStyles: AppearanceConfig.AVAILABLE_BRACKET_STYLES },
      );

      return Config.DEFAULT_CONFIG.appearance.bracketStyle;
    }

    return bracketStyle;
  }

  private getValidatedSpacing(spacing: Unvalidated<number>): number {
    if (typeof spacing !== "number") {
      this.logger.warn("Expected spacing to be a number.", { spacing, type: typeof spacing });
      return Config.DEFAULT_CONFIG.appearance.spacing;
    }

    if (spacing > AppearanceConfig.MAX_SPACING) {
      this.logger.warn(`Expected spacing to be less than ${AppearanceConfig.MAX_SPACING}.`, { spacing });
      return Config.DEFAULT_CONFIG.appearance.spacing;
    }

    if (AppearanceConfig.MIN_SPACING > spacing) {
      this.logger.warn(`Expected spacing to be greater than ${AppearanceConfig.MIN_SPACING}.`, { spacing });
      return Config.DEFAULT_CONFIG.appearance.spacing;
    }

    return spacing;
  }

  private getValidatedShowProviderChanges(showProviderChanges: Unvalidated<boolean>): boolean {
    if (typeof showProviderChanges !== "boolean") {
      this.logger.warn(
        "Expected 'show provider changes' option to be a boolean value.",
        { showProviderChanges, type: typeof showProviderChanges },
      );

      return Config.DEFAULT_CONFIG.appearance.showProviderChanges;
    }

    return showProviderChanges;
  }

  private getValidatedUseShaderColorFix(useShaderColorFix: Unvalidated<boolean>): boolean {
    if (typeof useShaderColorFix !== "boolean") {
      this.logger.warn(
        "Expected 'use shader color fix' option to be a boolean value.",
        { useShaderColorFix, type: typeof useShaderColorFix },
      );

      return Config.DEFAULT_CONFIG.appearance.useShaderColorFix;
    }

    return useShaderColorFix;
  }
}
