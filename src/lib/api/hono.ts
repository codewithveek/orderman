import { Hono } from 'hono';
import { menuRoutes } from './routes/menu';
import { orderRoutes } from './routes/orders';

export const app = new Hono().basePath('/api');

app.route('/menu', menuRoutes);
app.route('/orders', orderRoutes);
