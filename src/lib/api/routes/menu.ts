import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { db } from '@/lib/db';
import { menuItems } from '@/lib/db/schema';
import { menuItemSchema } from '@/lib/validations/menu';
import { eq, and } from 'drizzle-orm';

export const menuRoutes = new Hono()
    .get('/', async (c) => {
        const category = c.req.query('category');

        let query = db.select().from(menuItems);

        if (category) {
            // @ts-ignore - basic query builder for now
            query = db.select().from(menuItems).where(eq(menuItems.category, category));
        }

        const items = await query;
        return c.json(items);
    })
    .get('/:id', async (c) => {
        const id = parseInt(c.req.param('id'));
        if (isNaN(id)) return c.json({ error: 'Invalid ID' }, 400);

        const item = await db.query.menuItems.findFirst({
            where: eq(menuItems.id, id),
        });

        if (!item) return c.json({ error: 'Not found' }, 404);

        return c.json(item);
    })
    .post('/', zValidator('json', menuItemSchema), async (c) => {
        const data = c.req.valid('json');
        const { available, ...rest } = data;
        const insertData = {
            ...rest,
            available: available ? 1 : 0
        };

        const [result] = await db.insert(menuItems).values(insertData) as any;

        return c.json({ id: result.insertId, ...data }, 201);
    });
