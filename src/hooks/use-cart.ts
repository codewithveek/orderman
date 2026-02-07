'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartItem, MenuItem } from '@/types';
import { toast } from 'sonner';

interface CartContextType {
    items: CartItem[];
    addItem: (item: MenuItem, quantity?: number) => void;
    removeItem: (itemId: number) => void;
    updateQuantity: (itemId: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('cart', JSON.stringify(items));
        }
    }, [items, isInitialized]);

    const addItem = (menuItem: MenuItem, quantity = 1) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.menuItem.id === menuItem.id);
            if (existing) {
                return prev.map((i) =>
                    i.menuItem.id === menuItem.id
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                );
            }
            return [...prev, { menuItem, quantity }];
        });
        toast.success(`Added ${menuItem.name} to cart`);
    };

    const removeItem = (itemId: number) => {
        setItems((prev) => prev.filter((i) => i.menuItem.id !== itemId));
    };

    const updateQuantity = (itemId: number, quantity: number) => {
        if (quantity < 1) {
            removeItem(itemId);
            return;
        }
        setItems((prev) =>
            prev.map((i) => (i.menuItem.id === itemId ? { ...i, quantity } : i))
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = items.reduce(
        (acc, item) => acc + parseFloat(item.menuItem.price) * item.quantity,
        0
    );

    return (
        <CartContext.Provider
      value= {{
        items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice,
      }
}
    >
    { children }
    </CartContext.Provider>
  );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
