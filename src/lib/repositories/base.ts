import { db } from '@/lib/db';
import { MySqlTable } from 'drizzle-orm/mysql-core';
import { eq } from 'drizzle-orm';

export class BaseRepository<T extends MySqlTable> {
    constructor(protected table: T) { }

    async findAll() {
        return await db.select().from(this.table);
    }

    // Id type might vary, usually number or string. 
    // Drizzle doesn't have a unified PrimaryKey type easily accessibly for generic.
    // We'll assume ID is handled by specific implementations or passed as condition if needed.
    // But for common case:
    async findById(id: number | string) {
        // @ts-expect-error - dynamic query issues with generic table
        const result = await db.select().from(this.table).where(eq(this.table.id, id));
        return result[0];
    }

    async create(data: any) {
        // @ts-expect-error - generic insert
        const [result] = await db.insert(this.table).values(data) as any;
        return result.insertId ? { id: result.insertId, ...data } : { ...data };
    }
}
