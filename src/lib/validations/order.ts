import { z } from 'zod';

export const createOrderSchema = z.object({
    items: z.array(z.object({
        menuItemId: z.number(),
        quantity: z.number().min(1),
    })).min(1, "Order must contain at least one item"),
    deliveryDetails: z.object({
        name: z.string().min(1, "Name is required"),
        address: z.string().min(5, "Address must be at least 5 characters"),
        phone: z.string().min(5, "Phone number is required"),
        notes: z.string().optional(),
    }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
