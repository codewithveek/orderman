import { BaseRepository } from "./base";
import { orders, orderItems, menuItems } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq, desc, inArray } from "drizzle-orm";
import { InferModel } from "drizzle-orm";

// We can define types for input data to improve type safety
export type CreateOrderData = {
  userId: string;
  items: {
    menuItemId: number;
    quantity: number;
  }[];
  deliveryDetails: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
  };
};

export class OrderRepository extends BaseRepository<typeof orders> {
  constructor() {
    super(orders);
  }

  async findByUserId(userId: string) {
    return await db.query.orders.findMany({
      where: eq(orders.userId, userId),
      orderBy: [desc(orders.createdAt)],
      with: {
        items: true,
      },
    });
  }

  async findByIdWithItems(id: number) {
    return await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        items: true,
      },
    });
  }

  async createOrder(data: CreateOrderData) {
    const { items, deliveryDetails, userId } = data;

    // 1. Fetch menu items to prices
    const menuItemIds = items.map((i) => i.menuItemId);
    const dbMenuItems = await db
      .select()
      .from(menuItems)
      .where(inArray(menuItems.id, menuItemIds));

    let totalAmount = 0;
        const orderItemsData: {
            menuItemId: number;
            quantity: number;
            priceAtOrder: string; // or number, depends on your schema type for decimal, usually string in JS
            itemName: string;
        }[] = [];

        for (const item of items) {
      const dbItem = dbMenuItems.find((d) => d.id === item.menuItemId);
      if (!dbItem) throw new Error(`Menu item ${item.menuItemId} not found`);
      if (!dbItem.available)
        throw new Error(`Menu item ${dbItem.name} is not available`);

      const price = parseFloat(dbItem.price.toString());
      totalAmount += price * item.quantity;

      orderItemsData.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        priceAtOrder: dbItem.price,
        itemName: dbItem.name,
      });
    }

    // 2. Transaction
    return await db.transaction(async (tx) => {
      const [orderResult] = await tx.insert(orders).values({
        userId: userId,
        totalAmount: totalAmount.toFixed(2),
        deliveryAddress: deliveryDetails.address,
        deliveryPhone: deliveryDetails.phone,
        deliveryName: deliveryDetails.name,
        notes: deliveryDetails.notes,
        status: "pending",
      });

      const newOrderId = orderResult.insertId;

      await tx.insert(orderItems).values(
        orderItemsData.map((item) => ({
          orderId: newOrderId,
          ...item,
        }))
      );

      return { id: newOrderId, status: "pending", totalAmount };
    });
  }
}

export const orderRepository = new OrderRepository();
