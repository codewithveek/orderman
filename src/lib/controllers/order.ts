import { BaseController } from "./base";
import { orderRepository } from "@/lib/repositories/order";
import { Context } from "hono";
import { User } from "better-auth";
import { CreateOrderInput } from "@/lib/validations/order";

export class OrderController extends BaseController {
  async createOrder(c: Context) {
    const user = c.get("user") as User;
    if (!user) return this.error(c, "Unauthorized", 401);

    try {
      const data = c.req.valid("json" as never) as CreateOrderInput;
      const { items, deliveryDetails } = data;

      const order = await orderRepository.createOrder({
        userId: user.id,
        items,
        deliveryDetails,
      });

      return this.success(c, order, 201);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to create order";
      return this.error(c, message, 400);
    }
  }

  async getUserOrders(c: Context) {
    const user = c.get("user") as User;
    if (!user) return this.error(c, "Unauthorized", 401);

    try {
      const orders = await orderRepository.findByUserId(user.id);
      return this.success(c, orders);
    } catch (e) {
      return this.error(c, "Failed to fetch orders");
    }
  }

  async getOrderDetails(c: Context) {
    const user = c.get("user") as User;
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return this.error(c, "Invalid ID", 400);

    try {
      const order = await orderRepository.findByIdWithItems(id);
      if (!order) return this.error(c, "Order not found", 404);
      if (order.userId !== user.id) return this.error(c, "Unauthorized", 403);

      return this.success(c, order);
    } catch (e) {
      return this.error(c, "Failed to fetch order details");
    }
  }
}

export const orderController = new OrderController();
