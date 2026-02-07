import { BaseRepository } from './base';
import { menuItems } from '@/lib/db/schema';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';

export class MenuRepository extends BaseRepository<typeof menuItems> {
    constructor() {
        super(menuItems);
    }

    async findByCategory(category: string) {
        return await db.select().from(menuItems).where(eq(menuItems.category, category));
    }
}

export const menuRepository = new MenuRepository();
