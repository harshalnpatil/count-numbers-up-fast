import { describe, expect, it } from "vitest";
import {
  formatNumber,
  formatWithCommas,
  isCountableTarget,
  parseFpsInput,
} from "./counter-utils";

describe("formatWithCommas", () => {
  it("formats digits with locale grouping", () => {
    expect(formatWithCommas("1234567")).toBe((1234567).toLocaleString());
  });

  it("returns empty string for empty or non-digit input", () => {
    expect(formatWithCommas("")).toBe("");
    expect(formatWithCommas("abc")).toBe("");
  });

  it('handles "0"', () => {
    expect(formatWithCommas("0")).toBe((0).toLocaleString());
  });

  it("strips commas and non-digits before formatting", () => {
    expect(formatWithCommas("1,234")).toBe((1234).toLocaleString());
  });
});

describe("isCountableTarget", () => {
  it("rejects empty, zero, negative, and NaN targets", () => {
    expect(isCountableTarget("")).toBe(false);
    expect(isCountableTarget("0")).toBe(false);
    expect(isCountableTarget("-5")).toBe(false);
  });

  it("accepts positive integers", () => {
    expect(isCountableTarget("1")).toBe(true);
    expect(isCountableTarget("100")).toBe(true);
  });
});

describe("parseFpsInput", () => {
  it("clamps to 1–120 inclusive", () => {
    expect(parseFpsInput("0")).toBeUndefined();
    expect(parseFpsInput("1")).toBe(1);
    expect(parseFpsInput("120")).toBe(120);
    expect(parseFpsInput("121")).toBeUndefined();
  });

  it("returns undefined for non-numeric input", () => {
    expect(parseFpsInput("")).toBeUndefined();
    expect(parseFpsInput("abc")).toBeUndefined();
  });
});

describe("formatNumber", () => {
  it("formats large numbers with locale", () => {
    expect(formatNumber(1_000_000)).toBe((1_000_000).toLocaleString());
  });
});
