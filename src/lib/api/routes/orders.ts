import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createOrderSchema } from '@/lib/validations/order';
import { authMiddleware } from '@/lib/api/middleware/auth';
import { orderController } from '@/lib/controllers/order';

export const orderRoutes = new Hono()
    .use('*', authMiddleware)
    // @ts-expect-error - zValidator types mismatch
    .post('/', zValidator('json', createOrderSchema), (c) => orderController.createOrder(c))
    .get('/', (c) => orderController.getUserOrders(c))
    .get('/:id', (c) => orderController.getOrderDetails(c));
