import { MetricChange } from "~/entities/metric/MetricChange";
import { Time } from "~/entities/Time";

export interface MetricValueOptions<TValue> {
  initial: TValue;
  computeChange(prev: TValue, next: TValue): MetricChange<TValue>;
  formatValue(value: TValue): string | undefined;
  formatChange(change: TValue): string | undefined;
}

export class MetricValue<TValue> {
  private baseValue: TValue;
  private value: TValue;
  private formattedValue: string | undefined;
  private change: MetricChange<TValue>;
  private changeStartTime: Time;

  public constructor(
    private readonly options: MetricValueOptions<TValue>,
  ) {
    this.baseValue = this.options.initial;
    this.value = this.options.initial;
    this.formattedValue = this.options.formatValue(this.getValue());
    this.change = MetricChange.empty(Time.never());
    this.changeStartTime = Time.never();
  }

  public getValue(): TValue {
    return this.value;
  }

  public getChangeAt(time: Time): MetricChange<TValue> | undefined {
    if (this.getChange().isAccumulating(time)) {
      return this.getChange();
    }

    return undefined;
  }

  public getChange(): MetricChange<TValue> {
    return this.change;
  }

  public getChangeStartTime(): Time {
    return this.changeStartTime;
  }

  public getFormattedValue(): string | undefined {
    return this.formattedValue;
  }

  public setValue(value: TValue, currentTime: Time, silent: boolean = false): void {
    const formattedValue = this.options.formatValue(value);
    if (this.formattedValue === formattedValue) {
      return;
    }

    this.formattedValue = formattedValue;

    if (!this.change.isAccumulating(currentTime)) {
      this.baseValue = this.value;
      this.changeStartTime = currentTime;
    }

    if (!silent) {
      this.change = this.options.computeChange(this.baseValue, value);
    }

    this.value = value;

    if (!this.change.isAccumulating(currentTime)) {
      this.baseValue = value;
    }
  }
}
