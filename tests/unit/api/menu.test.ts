import { describe, it, expect, vi, beforeEach } from 'vitest';
import { menuRoutes } from '@/lib/api/routes/menu';
import { mockDb } from '../../mocks/db'; // We need to ensure aliases work or use relative
import { menuItems } from '@/lib/db/schema';

// Mock DB is already set up in setup.ts or we import it here to ensure it's used
// But vi.mock needs to be hoisted, so we do it here or in a setup file.
vi.mock('@/lib/db', () => ({
    db: {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        values: vi.fn().mockReturnValue([{ insertId: 1 }]),
        query: {
            menuItems: {
                findFirst: vi.fn(),
            }
        }
    }
}));

import { db } from '@/lib/db'; // Import after mock

describe('Menu API Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('GET / should return all menu items', async () => {
        const mockItems = [{ id: 1, name: 'Pizza', price: '10.00' }];
        // @ts-ignore
        db.select().from().mockResolvedValue(mockItems);

        const res = await menuRoutes.request('/', {
            method: 'GET',
        });

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual(mockItems);
    });

    it('GET /:id should return specific item', async () => {
        const mockItem = { id: 1, name: 'Pizza', price: '10.00' };
        (db.query.menuItems.findFirst as any).mockResolvedValue(mockItem);

        const res = await menuRoutes.request('/1', {
            method: 'GET',
        });

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual(mockItem);
    });

    it('GET /:id should return 404 if not found', async () => {
        (db.query.menuItems.findFirst as any).mockResolvedValue(null);

        const res = await menuRoutes.request('/999', {
            method: 'GET',
        });

        expect(res.status).toBe(404);
    });

    it('POST / should create a new item', async () => {
        const newItem = {
            name: 'Burger',
            description: 'Tasty',
            price: 12.50,
            imageUrl: 'http://example.com/img.jpg',
            category: 'mains',
            available: true
        };

        const res = await menuRoutes.request('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem)
        });

        expect(res.status).toBe(201);
        const body = await res.json();
        expect(body).toHaveProperty('id');
        expect(body.name).toBe(newItem.name);
    });
});
