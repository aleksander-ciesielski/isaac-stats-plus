export interface JsonSerializer {
  encode<TData = unknown>(decoded: TData): string;
  decode<TData = unknown>(encoded: string): TData;
}
