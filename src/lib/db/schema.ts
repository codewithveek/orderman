import { mysqlTable, varchar, int, decimal, timestamp, text, mysqlEnum } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// Users table (managed by better-auth)
export const users = mysqlTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: timestamp('email_verified'),
  image: varchar('image', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// Menu items
export const menuItems = mysqlTable('menu_items', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  available: int('available').default(1).notNull(), // standard boolean behavior in mysql is int(1)
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// Orders
export const orders = mysqlTable('orders', {
  id: int('id').primaryKey().autoincrement(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  status: mysqlEnum('status', [
    'pending',
    'confirmed',
    'preparing',
    'out_for_delivery',
    'delivered',
    'cancelled'
  ]).default('pending').notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  deliveryAddress: text('delivery_address').notNull(),
  deliveryPhone: varchar('delivery_phone', { length: 20 }).notNull(),
  deliveryName: varchar('delivery_name', { length: 255 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// Order items
export const orderItems = mysqlTable('order_items', {
  id: int('id').primaryKey().autoincrement(),
  orderId: int('order_id').notNull(),
  menuItemId: int('menu_item_id').notNull(),
  quantity: int('quantity').notNull(),
  priceAtOrder: decimal('price_at_order', { precision: 10, scale: 2 }).notNull(),
  itemName: varchar('item_name', { length: 255 }).notNull(), // Snapshot for historical accuracy
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  menuItem: one(menuItems, {
    fields: [orderItems.menuItemId],
    references: [menuItems.id],
  }),
}));
