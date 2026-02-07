import { vi } from 'vitest';

export const mockDb = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnValue([{ insertId: 1 }]),
    query: {
        menuItems: {
            findFirst: vi.fn(),
            findMany: vi.fn(),
        },
        orders: {
            findFirst: vi.fn(),
            findMany: vi.fn(),
        }
    },
    transaction: vi.fn((cb) => cb(mockDb)),
};

// Mock the module
vi.mock('@/lib/db', () => ({
    db: mockDb,
}));
