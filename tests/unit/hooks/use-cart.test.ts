import { renderHook, act } from '@testing-library/react';
import { useCart, useCartStore } from '@/hooks/use-cart';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MenuItem } from '@/types';

// Mock Sonner toast to avoid errors and verify calls if needed
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

const mockMenuItem: MenuItem = {
    id: 1,
    name: 'Burger',
    description: 'Juicy burger',
    price: '10.00',
    imageUrl: 'test.jpg',
    category: 'mains',
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
};

describe('useCart Hook', () => {
    beforeEach(() => {
        // Clear localStorage and reset store before each test
        localStorage.clear();
        useCartStore.setState({ items: [] });
    });

    it('should initialize with empty cart', () => {
        const { result } = renderHook(() => useCart());
        expect(result.current.items).toEqual([]);
        expect(result.current.totalItems).toBe(0);
        expect(result.current.totalPrice).toBe(0);
    });

    it('should add an item to the cart', () => {
        const { result } = renderHook(() => useCart());

        act(() => {
            result.current.addItem(mockMenuItem);
        });

        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].menuItem).toEqual(mockMenuItem);
        expect(result.current.items[0].quantity).toBe(1);
        expect(result.current.totalItems).toBe(1);
        expect(result.current.totalPrice).toBe(10.00);
    });

    it('should increment quantity if item already exists', () => {
        const { result } = renderHook(() => useCart());

        act(() => {
            result.current.addItem(mockMenuItem);
            result.current.addItem(mockMenuItem);
        });

        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].quantity).toBe(2);
        expect(result.current.totalItems).toBe(2);
        expect(result.current.totalPrice).toBe(20.00);
    });

    it('should remove an item from the cart', () => {
        const { result } = renderHook(() => useCart());

        act(() => {
            result.current.addItem(mockMenuItem);
            result.current.removeItem(mockMenuItem.id);
        });

        expect(result.current.items).toHaveLength(0);
        expect(result.current.totalItems).toBe(0);
    });

    it('should update item quantity', () => {
        const { result } = renderHook(() => useCart());

        act(() => {
            result.current.addItem(mockMenuItem);
            result.current.updateQuantity(mockMenuItem.id, 5);
        });

        expect(result.current.items[0].quantity).toBe(5);
        expect(result.current.totalItems).toBe(5);
        expect(result.current.totalPrice).toBe(50.00);
    });

    it('should remove item when updating quantity to 0', () => {
        const { result } = renderHook(() => useCart());

        act(() => {
            result.current.addItem(mockMenuItem);
            result.current.updateQuantity(mockMenuItem.id, 0);
        });

        expect(result.current.items).toHaveLength(0);
    });

    it('should clear the cart', () => {
        const { result } = renderHook(() => useCart());

        act(() => {
            result.current.addItem(mockMenuItem);
            result.current.clearCart();
        });

        expect(result.current.items).toHaveLength(0);
    });

    // Test persistence implicitly or explicitly if needed
    // logic handling persistence is in the store, useCart is just a wrapper.
    // Ideally we test that data persists to localStorage.
    it('should persist data to localStorage', () => {
        const { result } = renderHook(() => useCart());

        act(() => {
            result.current.addItem(mockMenuItem);
        });

        const stored = localStorage.getItem('cart-storage');
        expect(stored).toContain('Burger');
    });
});
