import { describe, it, expect } from "vitest";
import { computeTotals } from "@/store/cart.store";
import { CartItem } from "@/types";

describe("Cart Logic", () => {
  describe("computeTotals", () => {
    it("should return 0 totals for empty items", () => {
      const result = computeTotals([]);
      expect(result).toEqual({ totalItems: 0, totalPrice: 0 });
    });

    it("should calculate totals correctly for single item", () => {
      const items: CartItem[] = [
        {
          menuItem: {
            id: 1,
            name: "Item 1",
            price: "10.00",
            imageUrl: "image1.jpg",
            category: "Main Course",
            available: true,
            description: "Delicious main course",
          },
          quantity: 2,
        },
      ];
      const result = computeTotals(items);
      expect(result.totalItems).toBe(2);
      expect(result.totalPrice).toBe(20.0);
    });

    it("should calculate totals correctly for multiple items", () => {
      const items: CartItem[] = [
        {
          menuItem: {
            id: 1,
            name: "Item 1",
            price: "10.00",
            imageUrl: "image1.jpg",
            category: "Main Course",
            available: true,
            description: "Delicious main course",
          },
          quantity: 2,
        },
        {
          menuItem: {
            id: 2,
            name: "Item 2",
            price: "5.50",
            imageUrl: "image2.jpg",
            category: "Appetizer",
            available: true,
            description: "Delicious appetizer",
          },
          quantity: 1,
        },
      ];
      // 2 items * 10.00 + 1 item * 5.50 = 25.50
      // Total quantity = 3
      const result = computeTotals(items);
      expect(result.totalItems).toBe(3);
      expect(result.totalPrice).toBe(25.5);
    });
  });
});
