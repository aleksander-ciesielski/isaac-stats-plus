import type { Player } from "~/entities/player/Player";
import type { BracketCharacters } from "~/types/renderer/BracketCharacters";
import type { LoadoutEntry } from "~/entities/loadout/LoadoutEntry";
import type { MetricValue } from "~/entities/metric/MetricValue";
import { PlayerType } from "isaac-typescript-definitions";
import { MetricChange } from "~/entities/metric/MetricChange";
import { StatSlot } from "~/entities/stat/StatSlot";
import { FontFactory } from "~/services/renderer/FontFactory";
import { RenderPositionProvider } from "~/services/renderer/RenderPositionProvider";
import { ColorFactory } from "~/services/renderer/ColorFactory";
import { ConfigService } from "~/services/config/ConfigService";
import { LoadoutService } from "~/services/LoadoutService";
import { StatService } from "~/services/stat/StatService";
import { ProviderColor } from "~/entities/config/appearance/ProviderColor";
import { Singleton } from "~/app/ioc/decorators/Singleton";
import { Inject } from "~/app/ioc/decorators/Inject";
import { CORE_STAT_EXTENSIONS } from "~/data/stat/CORE_STAT_EXTENSIONS";
import { BracketStyle } from "~/entities/config/appearance/BracketStyle";
import { Time } from "~/entities/Time";
import { ErrorWithContext } from "~/errors/ErrorWithContext";
import { TimeProvider } from "~/services/renderer/TimeProvider";
import { RGBAColor } from "~/entities/renderer/RGBAColor";
import { RGBColor } from "~/entities/renderer/RGBColor";
import { speed } from "~/core/stats/speed";
import { Interpolation } from "~/entities/interpolation/Interpolation";

@Singleton()
export class Renderer {
  private static readonly MAX_RENDERED_PLAYERS = 2;
  private static readonly PROVIDER_CHANGE_OPACITY = 0.5;
  private static readonly PROVIDER_CHANGE_SLIDE_PX = 8;

  private static readonly POSITIVE_CHANGE_COLOR = new RGBColor(0, 1, 0);
  private static readonly NEGATIVE_CHANGE_COLOR = new RGBColor(1, 0, 0);

  private static readonly BRACKET_STYLE_SIGNS = {
    [BracketStyle.None]: { prefix: "", suffix: "" },
    [BracketStyle.Round]: { prefix: "(", suffix: ")" },
    [BracketStyle.Square]: { prefix: "[", suffix: "]" },
    [BracketStyle.Curly]: { prefix: "{", suffix: "}" },
    [BracketStyle.Angle]: { prefix: "<", suffix: ">" },
  } satisfies Record<BracketStyle, BracketCharacters>;

  private static getProviderColorRGB(providerColor: ProviderColor, player: Player): RGBColor {
    if (providerColor === ProviderColor.None) {
      return player.isMainPlayer()
        ? new RGBColor(1, 1, 1)
        : new RGBColor(1, 0.75, 0.75);
    }

    if (providerColor === ProviderColor.Grey) return new RGBColor(1, 1, 1);
    if (providerColor === ProviderColor.Red) return new RGBColor(1, 0.568627, 0.568627);
    if (providerColor === ProviderColor.Green) return new RGBColor(0.568627, 1, 0.568627);
    if (providerColor === ProviderColor.Blue) return new RGBColor(0.568627, 0.819608, 1);
    if (providerColor === ProviderColor.Orange) return new RGBColor(1, 0.768627, 0.568627);
    if (providerColor === ProviderColor.Magenta) return new RGBColor(1, 0.568627, 0.819608);
    if (providerColor === ProviderColor.Cyan) return new RGBColor(0.568627, 1, 1);

    throw new ErrorWithContext(
      "Invalid provider color value.",
      { providerColor, type: typeof providerColor },
    );
  }

  private readonly providerFont: Font;

  public constructor(
    @Inject(TimeProvider) private readonly timeProvider: TimeProvider,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(LoadoutService) private readonly loadoutService: LoadoutService,
    @Inject(StatService) private readonly statService: StatService,
    @Inject(RenderPositionProvider) private readonly renderPositionProvider: RenderPositionProvider,
    @Inject(FontFactory) private readonly fontFactory: FontFactory,
    @Inject(ColorFactory) private readonly colorFactory: ColorFactory,
  ) {
    this.providerFont = this.fontFactory.create("font/luaminioutlined.fnt");
  }

  public render(players: Player[]): void {
    players.slice(0, Renderer.MAX_RENDERED_PLAYERS).forEach((player) => {
      CORE_STAT_EXTENSIONS.forEach((statType) => {
        const slot = new StatSlot(statType, player);

        if (this.shouldRenderSlot(slot)) {
          this.renderSlot(slot);
        }
      });
    });
  }

  private renderSlot(slot: StatSlot): void {
    const loadoutEntry = this.loadoutService.getEntry(slot);

    this.renderValue(slot, loadoutEntry);
    this.renderChange(slot, loadoutEntry);
  }

  private renderValue(slot: StatSlot, loadoutEntry: LoadoutEntry): void {
    const formattedValue = (loadoutEntry.getActiveProvider().getValue()?.getFormattedValue() === undefined)
      ? loadoutEntry.getInactiveProvider().getValue()?.getFormattedValue()
      : loadoutEntry.getActiveProvider().getValue()?.getFormattedValue();

    if (formattedValue === undefined) {
      return;
    }

    const [x, y] = this.renderPositionProvider.getPosition(
      slot,
      this.statService.getStatValue(slot)?.getFormattedValue(),
    );

    const previousColor = Renderer.getProviderColorRGB(
      loadoutEntry.getInactiveProvider().getProviderColor(),
      slot.player,
    ).asRGBA(this.getProviderValueOpacity(loadoutEntry.getInactiveProvider().getValue()));

    const currentColor = Renderer.getProviderColorRGB(
      loadoutEntry.getActiveProvider().getProviderColor(),
      slot.player,
    ).asRGBA(this.getProviderValueOpacity(loadoutEntry.getActiveProvider().getValue()));

    const finalColor = this.getInterpolatedColor(loadoutEntry, previousColor, currentColor);

    this.providerFont.DrawStringUTF8(
      this.getValueWithBrackets(formattedValue),
      x,
      y,
      this.colorFactory.createFontColor(finalColor),
      0,
      false,
    );
  }

  private renderChange(slot: StatSlot, loadoutEntry: LoadoutEntry): void {
    if (!this.configService.getConfig().appearance.showsProviderChanges()) {
      return;
    }

    const ANIMATION_START_TIME = MetricChange.ANIMATION_DURATION.plus(Time.ms(1_000));
    const FADE_IN_DURATION = Time.ms(500);
    const FADE_OUT_DURATION = Time.ms(750);
    const SLIDE_IN_DURATION = Time.ms(400);

    const timeBeforeAnimationStart = this.timeProvider.getLastRenderTime()
      .minus(ANIMATION_START_TIME)
      .minus(FADE_IN_DURATION)
      .minus(FADE_OUT_DURATION);

    const statChange = this.statService.getStatValue(slot)?.getChangeAt(timeBeforeAnimationStart);

    const activeProviderValue = loadoutEntry.getActiveProvider().getValue();
    const activeProviderChange = activeProviderValue?.getChangeAt(timeBeforeAnimationStart);

    const inactiveProviderValue = loadoutEntry.getInactiveProvider().getValue();
    const inactiveProviderChange = inactiveProviderValue?.getChangeAt(timeBeforeAnimationStart);

    const fadeInOpacity = this.timeProvider.interpolate({
      output: [0, 1],
      easing: Interpolation.linear,
      duration: FADE_IN_DURATION,
      start: Time.max(
        statChange?.lastUpdate.plus(ANIMATION_START_TIME),
        activeProviderChange?.lastUpdate.minus(FADE_OUT_DURATION),
        activeProviderValue?.getChangeStartTime().plus(FADE_IN_DURATION),
      ),
    });

    const fadeOutOpacity = this.timeProvider.interpolate({
      output: [1, 0],
      easing: Interpolation.linear,
      duration: FADE_OUT_DURATION,
      start: fadeInOpacity.getFinishTime().plus(MetricChange.ANIMATION_DURATION),
    });

    const slideInOffset = this.timeProvider.interpolate({
      output: [0, Renderer.PROVIDER_CHANGE_SLIDE_PX],
      easing: Interpolation.easeOut,
      duration: SLIDE_IN_DURATION,
      start: fadeInOpacity.getStartTime(),
    });

    const previousColor = this.getChangeColor(
      inactiveProviderChange?.isPositive ?? activeProviderChange?.isPositive ?? false,
      this.getProviderChangeOpacity(inactiveProviderChange) * fadeInOpacity.getValue() * fadeOutOpacity.getValue(),
    );

    const currentColor = this.getChangeColor(
      activeProviderChange?.isPositive ?? inactiveProviderChange?.isPositive ?? false,
      this.getProviderChangeOpacity(activeProviderChange) * fadeInOpacity.getValue() * fadeOutOpacity.getValue(),
    );

    const finalColor = this.getInterpolatedColor(loadoutEntry, previousColor, currentColor);
    const fontColor = this.colorFactory.createFontColor(finalColor);

    const displayProviderValue = activeProviderValue?.getFormattedValue() ?? inactiveProviderValue?.getFormattedValue();
    const displayProviderChange = activeProviderChange?.formattedValue ?? inactiveProviderChange?.formattedValue;
    if (displayProviderValue === undefined || displayProviderChange === undefined) {
      return;
    }

    const statText = this.statService.getStatValue(slot)?.getFormattedValue();
    const providerText = this.getValueWithBrackets(displayProviderValue);
    const [x, y] = this.renderPositionProvider.getPosition(
      slot,
      (statText === undefined)
        ? providerText
        : `${statText}${providerText}`,
    );

    this.providerFont.DrawStringUTF8(
      this.getValueWithBrackets(displayProviderChange),
      x + slideInOffset.getValue(),
      y,
      fontColor,
      0,
      false,
    );
  }

  private getInterpolatedColor(
    loadoutEntry: LoadoutEntry,
    previousColor: RGBAColor,
    currentColor: RGBAColor,
  ): RGBAColor {
    const gameStartOpacity = this.timeProvider.interpolate({
      output: [0, 1],
      easing: Interpolation.linear,
      duration: Time.ms(150),
      start: Time.ms(250),
    });

    const statUpdateDuckOpacity = this.timeProvider.interpolate({
      output: [0, 1],
      easing: Interpolation.linear,
      duration: Time.ms(500),
      start: this.statService
        .getStatValue(loadoutEntry.statSlot)
        ?.getChange()
        .lastUpdate
        .plus(MetricChange.ANIMATION_DURATION),
    });

    const interpolatedColor = this.timeProvider.interpolate({
      output: [
        previousColor
          .withAlpha(previousColor.alpha * gameStartOpacity.getValue() * statUpdateDuckOpacity.getValue())
          .asArray(),
        currentColor
          .withAlpha(currentColor.alpha * gameStartOpacity.getValue() * statUpdateDuckOpacity.getValue())
          .asArray(),
      ],
      easing: Interpolation.linear,
      duration: Time.ms(150),
      start: loadoutEntry.condition.getLastChange(),
    });

    return RGBAColor.fromArray(interpolatedColor.getValue());
  }

  private getProviderChangeOpacity(providerChange: MetricChange<any> | undefined): number {
    if (providerChange?.formattedValue === undefined) {
      return 0;
    }

    return Renderer.PROVIDER_CHANGE_OPACITY;
  }

  private getProviderValueOpacity(providerValue: MetricValue<any> | undefined): number {
    if (providerValue?.getFormattedValue() === undefined) {
      return 0;
    }

    return this.configService.getConfig().appearance.getTextOpacity();
  }

  private getChangeColor(isPositive: boolean, opacity: number): RGBAColor {
    return isPositive
      ? Renderer.POSITIVE_CHANGE_COLOR.asRGBA(opacity)
      : Renderer.NEGATIVE_CHANGE_COLOR.asRGBA(opacity);
  }

  private getValueWithBrackets(value: string): string {
    const { prefix, suffix } = this.getBracketCharacters();
    return `${prefix}${value}${suffix}`;
  }

  private getBracketCharacters(): BracketCharacters {
    const bracketStyle = this.configService.getConfig().appearance.getBracketStyle();
    const bracketCharacters = Renderer.BRACKET_STYLE_SIGNS[bracketStyle] as BracketCharacters | undefined;

    if (bracketCharacters === undefined) {
      throw new ErrorWithContext("Unknown bracket style.", { bracketStyle, bracketStyleType: typeof bracketStyle });
    }

    return bracketCharacters;
  }

  private shouldRenderSlot(slot: StatSlot): boolean {
    // Jacob & Esau share the same speed stat, so it should be rendered just for Jacob.
    const isEsauSpeed = (
      slot.stat === speed
      && slot.player.entityPlayer.GetPlayerType() === PlayerType.ESAU
    );

    return !isEsauSpeed;
  }
}
