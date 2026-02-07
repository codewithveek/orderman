import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { db } from '@/lib/db';
import { orders, orderItems, menuItems } from '@/lib/db/schema';
import { createOrderSchema } from '@/lib/validations/order';
import { authMiddleware } from '@/lib/api/middleware/auth';
import { eq, desc, inArray } from 'drizzle-orm';
import { User } from 'better-auth'; // or your User type

export const orderRoutes = new Hono()
    .use('*', authMiddleware)
    .post('/', zValidator('json', createOrderSchema), async (c) => {
        const user = c.get('user') as User;
        const { items, deliveryDetails } = c.req.valid('json');

        if (!user) {
            return c.json({ error: 'User not found in context' }, 401);
        }

        // 1. Fetch menu items to get prices and validate availability
        const menuItemIds = items.map(i => i.menuItemId);
        const dbMenuItems = await db.select().from(menuItems).where(inArray(menuItems.id, menuItemIds));

        // Check if all items exist and are available
        // Also calculate total
        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of items) {
            const dbItem = dbMenuItems.find(d => d.id === item.menuItemId);
            if (!dbItem) {
                return c.json({ error: `Menu item ${item.menuItemId} not found` }, 400);
            }
            if (!dbItem.available) {
                return c.json({ error: `Menu item ${dbItem.name} is not available` }, 400);
            }

            const price = parseFloat(dbItem.price.toString());
            totalAmount += price * item.quantity;

            orderItemsData.push({
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                priceAtOrder: dbItem.price,
                itemName: dbItem.name,
            });
        }

        // 2. Create Order Transaction
        // Drizzle transaction
        const orderId = await db.transaction(async (tx) => {
            const [orderResult] = await tx.insert(orders).values({
                userId: user.id,
                totalAmount: totalAmount.toFixed(2),
                deliveryAddress: deliveryDetails.address,
                deliveryPhone: deliveryDetails.phone,
                deliveryName: deliveryDetails.name,
                notes: deliveryDetails.notes,
                status: 'pending',
            });
            // insertId is typed as number for mysql2 result usually, or we can use $returningId() in recent drizzle?
            // standard result.insertId works.
            const newOrderId = orderResult.insertId;

            await tx.insert(orderItems).values(
                orderItemsData.map(item => ({
                    orderId: newOrderId,
                    ...item
                }))
            );

            return newOrderId;
        });

        return c.json({ id: orderId, status: 'pending' }, 201);
    })
    .get('/', async (c) => {
        const user = c.get('user') as User;

        const userOrders = await db.query.orders.findMany({
            where: eq(orders.userId, user.id),
            orderBy: [desc(orders.createdAt)],
            with: {
                items: true,
            }
        });

        return c.json(userOrders);
    })
    .get('/:id', async (c) => {
        const user = c.get('user') as User;
        const id = parseInt(c.req.param('id'));

        if (isNaN(id)) return c.json({ error: 'Invalid ID' }, 400);

        const order = await db.query.orders.findFirst({
            where: eq(orders.id, id),
            with: {
                items: true,
            }
        });

        if (!order) return c.json({ error: 'Order not found' }, 404);
        if (order.userId !== user.id) return c.json({ error: 'Unauthorized' }, 403);

        return c.json(order);
    });
