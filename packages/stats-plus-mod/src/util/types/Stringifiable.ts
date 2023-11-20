export interface Stringifiable {
  toString(): string;
}

export function isStringifiable(value: any): value is Stringifiable {
  if (value === undefined) {
    return false;
  }

  if (typeof value === "object" || typeof value === "function") {
    return (typeof value.toString === "function");
  }

  return true;
}
