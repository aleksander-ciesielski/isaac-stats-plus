import { toFixed } from "~/util/toFixed";

export function toFixedFormatted(value: number, digits: number): string {
  const str = toFixed(value, digits).toString();
  const hasFractionalPart = str.includes(".");

  const missingZeroes = hasFractionalPart
    ? digits - str.split(".")[1]!.length
    : digits;

  if (missingZeroes === 0) {
    return str;
  }

  return hasFractionalPart
    ? str.padEnd(str.length + missingZeroes, "0")
    : `${str}.`.padEnd(str.length + missingZeroes + 1, "0");
}
