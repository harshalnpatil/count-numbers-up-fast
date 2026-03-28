/** Pure helpers for target input, FPS clamping, and display formatting. */

export function formatWithCommas(value: string): string {
  const num = value.replace(/,/g, "").replace(/\D/g, "");
  if (!num) return "";
  return parseInt(num, 10).toLocaleString();
}

export function isCountableTarget(targetNumber: string): boolean {
  const target = parseInt(targetNumber, 10);
  return !isNaN(target) && target > 0;
}

/** Returns FPS when input is a valid integer in [1, 120]; otherwise undefined (caller keeps prior fps). */
export function parseFpsInput(value: string): number | undefined {
  const parsed = parseInt(value, 10);
  if (!isNaN(parsed) && parsed >= 1 && parsed <= 120) {
    return parsed;
  }
  return undefined;
}

export function formatNumber(num: number): string {
  return num.toLocaleString();
}
