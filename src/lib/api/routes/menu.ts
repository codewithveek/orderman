import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { menuController } from '@/lib/controllers/menu';
import { menuItemSchema } from "@/lib/validations/menu";

export const menuRoutes = new Hono()
  .get('/', (c) => menuController.getMenuItems(c))
  .get('/:id', (c) => menuController.getMenuItem(c))
  .post('/', zValidator('json', menuItemSchema), (c) => menuController.createMenuItem(c));
