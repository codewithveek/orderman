import { describe, it, expect } from 'vitest';
import { createOrderSchema } from '@/lib/validations/order';
import { menuItemSchema } from '@/lib/validations/menu';

describe('Validations', () => {
    describe('createOrderSchema', () => {
        it('should validate a correct order', () => {
            const validOrder = {
                items: [{ menuItemId: 1, quantity: 2 }],
                deliveryDetails: {
                    name: 'John Doe',
                    address: '123 Main St',
                    phone: '555-0123',
                    notes: 'Ring bell'
                }
            };
            const result = createOrderSchema.safeParse(validOrder);
            expect(result.success).toBe(true);
        });

        it('should fail if items array is empty', () => {
            const invalidOrder = {
                items: [],
                deliveryDetails: {
                    name: 'John Doe',
                    address: '123 Main St',
                    phone: '555-0123'
                }
            };
            const result = createOrderSchema.safeParse(invalidOrder);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Order must contain at least one item');
            }
        });

        it('should fail if quantity is less than 1', () => {
             const invalidOrder = {
                items: [{ menuItemId: 1, quantity: 0 }],
                deliveryDetails: {
                    name: 'John Doe',
                    address: '123 Main St',
                    phone: '555-0123'
                }
            };
            const result = createOrderSchema.safeParse(invalidOrder);
            expect(result.success).toBe(false);
        });

        it('should fail if delivery details are missing fields', () => {
             const invalidOrder = {
                items: [{ menuItemId: 1, quantity: 1 }],
                deliveryDetails: {
                    // name missing
                    address: '123 Main St',
                    phone: '555-0123'
                }
            };
            const result = createOrderSchema.safeParse(invalidOrder);
            expect(result.success).toBe(false);
        });

        it('should fail if address is too short', () => {
             const invalidOrder = {
                items: [{ menuItemId: 1, quantity: 1 }],
                deliveryDetails: {
                    name: 'John Doe',
                    address: '123', // Too short
                    phone: '555-0123'
                }
            };
            const result = createOrderSchema.safeParse(invalidOrder);
            expect(result.success).toBe(false);
        });
    });

    describe('menuItemSchema', () => {
        it('should validate a correct menu item', () => {
            const validItem = {
                name: 'Pizza',
                description: 'Delicious cheese pizza',
                price: 12.99,
                imageUrl: 'https://example.com/pizza.jpg',
                category: 'mains',
                available: true
            };
            const result = menuItemSchema.safeParse(validItem);
            expect(result.success).toBe(true);
        });

        it('should fail if price is negative', () => {
            const invalidItem = {
                name: 'Pizza',
                description: 'Delicious cheese pizza',
                price: -5,
                imageUrl: 'https://example.com/pizza.jpg',
                category: 'mains',
                available: true
            };
            const result = menuItemSchema.safeParse(invalidItem);
            expect(result.success).toBe(false);
        });

        it('should fail if imageUrl is invalid', () => {
             const invalidItem = {
                name: 'Pizza',
                description: 'Delicious cheese pizza',
                price: 12.99,
                imageUrl: 'not-a-url',
                category: 'mains',
                available: true
            };
            const result = menuItemSchema.safeParse(invalidItem);
            expect(result.success).toBe(false);
        });
    });
});
