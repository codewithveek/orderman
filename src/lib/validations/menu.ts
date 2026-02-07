import { z } from 'zod';

export const menuItemSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().positive('Price must be positive'),
    imageUrl: z.string().url('Invalid image URL'),
    category: z.string().min(1, 'Category is required'),
    available: z.boolean().default(true),
});

export type MenuItemInput = z.infer<typeof menuItemSchema>;
