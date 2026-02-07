import { describe, it, expect } from "vitest";
import { formatCurrency } from "@/lib/utils";

describe("Utils", () => {
  describe("formatCurrency", () => {
    it("should format numbers correctly", () => {
      expect(formatCurrency(10)).toBe("$10.00");
      expect(formatCurrency(10.5)).toBe("$10.50");
      expect(formatCurrency(1000)).toBe("$1,000.00");
    });

    it("should format strings correctly", () => {
      expect(formatCurrency("10")).toBe("$10.00");
      expect(formatCurrency("10.50")).toBe("$10.50");
    });
  });
});
