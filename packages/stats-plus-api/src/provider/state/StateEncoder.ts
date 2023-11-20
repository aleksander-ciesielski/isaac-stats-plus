export interface StateEncoder<TValue> {
  encode(decoded: TValue): string;
  decode(encoded: string): TValue;
}
