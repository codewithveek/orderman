"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, MenuItem } from "@/types";
import { toast } from "sonner";

interface CartState {
  items: CartItem[];
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// Helper to compute totals
export const computeTotals = (items: CartItem[]) => {
  if (items.length === 0) {
    return { totalItems: 0, totalPrice: 0 };
  }
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce(
    (acc, item) => acc + parseFloat(item.menuItem.price) * item.quantity,
    0
  );
  return { totalItems, totalPrice };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      addItem: (menuItem, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.menuItem.id === menuItem.id
          );
          let updatedItems;
          if (existing) {
            updatedItems = state.items.map((i) =>
              i.menuItem.id === menuItem.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            );
          } else {
            updatedItems = [...state.items, { menuItem, quantity }];
          }
          const totals = computeTotals(updatedItems);
          return { items: updatedItems, ...totals };
        });
        toast.success(`Added ${menuItem.name} to cart`);
      },
      removeItem: (itemId) => {
        set((state) => {
          const updatedItems = state.items.filter(
            (i) => i.menuItem.id !== itemId
          );
          const totals = computeTotals(updatedItems);
          return { items: updatedItems, ...totals };
        });
      },
      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) {
          get().removeItem(itemId);
          return;
        }
        set((state) => {
          const updatedItems = state.items.map((i) =>
            i.menuItem.id === itemId ? { ...i, quantity } : i
          );
          const totals = computeTotals(updatedItems);
          return { items: updatedItems, ...totals };
        });
      },
      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
