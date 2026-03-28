import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges class names and resolves tailwind conflicts", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("handles conditional and array inputs", () => {
    expect(cn("base", false && "hidden", ["a", undefined, "b"])).toBe("base a b");
  });
});
