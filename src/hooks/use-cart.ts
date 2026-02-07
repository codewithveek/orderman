'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, MenuItem } from '@/types';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

interface CartState {
    items: CartItem[];
    addItem: (item: MenuItem, quantity?: number) => void;
    removeItem: (itemId: number) => void;
    updateQuantity: (itemId: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;    // Changed to function to compute dynamically or getter
    totalPrice: () => number;    // Changed to function
}

// Helper to compute totals
const computeTotals = (items: CartItem[]) => {
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
            addItem: (menuItem, quantity = 1) => {
                set((state) => {
                    const existing = state.items.find((i) => i.menuItem.id === menuItem.id);
                    if (existing) {
                        const updatedItems = state.items.map((i) =>
                            i.menuItem.id === menuItem.id
                                ? { ...i, quantity: i.quantity + quantity }
                                : i
                        );
                        return { items: updatedItems };
                    }
                    return { items: [...state.items, { menuItem, quantity }] };
                });
                toast.success(`Added ${menuItem.name} to cart`);
            },
            removeItem: (itemId) => {
                set((state) => ({
                    items: state.items.filter((i) => i.menuItem.id !== itemId),
                }));
            },
            updateQuantity: (itemId, quantity) => {
                if (quantity < 1) {
                    get().removeItem(itemId);
                    return;
                }
                set((state) => ({
                    items: state.items.map((i) =>
                        i.menuItem.id === itemId ? { ...i, quantity } : i
                    ),
                }));
            },
            clearCart: () => set({ items: [] }),
            totalItems: () => computeTotals(get().items).totalItems,
            totalPrice: () => computeTotals(get().items).totalPrice,
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
            skipHydration: true, // We handle hydration manually to avoid mismatch or use a wrapper
        }
    )
);

// Wrapper hook to handle hydration safe usages
// Because Next.js SSR will differ from localStorage
export function useCart() {
    const store = useCartStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        useCartStore.persist.rehydrate();
        setIsMounted(true);
    }, []);

    // Return default empty state during SSR/hydration to prevent mismatch
    // Or just return store but be aware of mismatch
    // Actually, widespread pattern is to return null or loading if not mounted, 
    // but that breaks hook rules if we return different shape. 

    // Better pattern for hydration mismatch in Next.js with Zustand persist:
    // Return the store output, but inside components, suppressed hydration warning or a specialized component.
    // However, since we want to be drop-in replacement, let's try to match the interface.

    // The previous context returned derived values totalItems and totalPrice as numbers, not functions.
    // We should compute them here to match the interface.

    const { totalItems, totalPrice } = computeTotals(store.items);

    if (!isMounted) {
        return {
            ...store,
            items: [],
            totalItems: 0,
            totalPrice: 0,
        };
    }

    return {
        ...store,
        totalItems,
        totalPrice,
    };
}
