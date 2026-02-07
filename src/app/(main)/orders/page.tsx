'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Order } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { createAuthClient } from 'better-auth/react';

const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')
});

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const session = authClient.useSession();

    useEffect(() => {
        if (session.isPending) return;
        if (!session.data) {
            // router.push('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders');
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error('Failed to fetch orders', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [session.isPending, session.data, router]);

    if (loading || session.isPending) {
        return <div className="p-8 text-center">Loading orders...</div>;
    }

    if (!session.data) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
                <h1 className="text-2xl font-bold">Please login to view orders</h1>
                <Button onClick={() => router.push('/login')}>Login</Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">My Orders</h1>
            {orders.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        No orders found. <Link href="/menu" className="underline">Order something delicious!</Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {orders.map((order) => (
                        <Card key={order.id} className="overflow-hidden">
                            <CardHeader className="bg-muted/50 p-4 flex flex-row items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-base">Order #{order.id}</CardTitle>
                                    <div className="text-sm text-muted-foreground">
                                        {format(new Date(order.createdAt), 'PPP p')}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                                        {order.status}
                                    </Badge>
                                    <Button asChild size="sm" variant="outline">
                                        <Link href={`/orders/${order.id}`}>View Details</Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 flex justify-between items-center">
                                <div>
                                    <span className="text-sm text-muted-foreground">Total Amount</span>
                                    <div className="font-bold text-lg">${order.totalAmount}</div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {order.items?.length || 0} items
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
