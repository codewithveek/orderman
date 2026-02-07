export type User = {
    id: string;
    name: string;
    email: string;
    image?: string;
};

export type MenuItem = {
    id: number;
    name: string;
    description: string;
    price: string; // decimal string
    imageUrl: string;
    category: string;
    available: boolean; // boolean from schema
};

export type CartItem = {
    menuItem: MenuItem;
    quantity: number;
};

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export type Order = {
    id: number;
    userId: string;
    status: OrderStatus;
    totalAmount: string;
    deliveryAddress: string;
    deliveryPhone: string;
    deliveryName: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    items?: OrderItem[];
};

export type OrderItem = {
    id: number;
    orderId: number;
    menuItemId: number;
    quantity: number;
    priceAtOrder: string;
    itemName: string;
};
