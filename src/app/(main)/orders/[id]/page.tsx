"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Order, OrderStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import Link from "next/link";
import {
  Check,
  Clock,
  Loader,
  Package,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useOrderUpdates } from "@/hooks/use-order-updates";

const STEPS = [
  {
    id: "pending",
    label: "Order Placed",
    description: "We have received your order",
    icon: Clock,
  },
  {
    id: "confirmed",
    label: "Order Confirmed",
    description: "Your order has been confirmed",
    icon: Check,
  },
  {
    id: "preparing",
    label: "Preparing",
    description: "We are preparing your food",
    icon: UtensilsCrossed,
  },
  {
    id: "out_for_delivery",
    label: "Out for Delivery",
    description: "Your order is on the way",
    icon: Truck,
  },
  {
    id: "delivered",
    label: "Delivered",
    description: "Enjoy your meal",
    icon: Package,
  },
] as const;

export default function OrderDetailsPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Initial fetch
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            setError("Unauthorized");
          } else {
            setError("Order not found");
          }
          return;
        }
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError("Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  // Real-time updates
  const { status } = useOrderUpdates(order?.id || 0, order?.status || "");

  // Sync local order status with real-time status
  useEffect(() => {
    if (order && status && order.status !== status) {
      setOrder((prev) =>
        prev ? { ...prev, status: status as OrderStatus } : null
      );
    }
  }, [status, order]);

  if (loading)
    return (
      <div className="p-8 text-center mx-auto max-w-md flex flex-col items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
        Loading order details...
      </div>
    );
  if (error)
    return <div className="p-8 text-center text-destructive">{error}</div>;
  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Order #{order.id}</h1>
        <Badge
          className="text-base px-4 py-1 capitalize animate-in fade-in zoom-in duration-300"
          key={order.status}
        >
          {order.status.replace("_", " ")}
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {STEPS.map((step, index) => {
                  const currentStatusIndex = STEPS.findIndex(
                    (s) => s.id === order.status
                  );
                  const stepIndex = index;
                  const isCompleted = stepIndex < currentStatusIndex;
                  const isCurrent = stepIndex === currentStatusIndex;
                  const isPending = stepIndex > currentStatusIndex;

                  return (
                    <div
                      key={step.id}
                      className="relative pl-10 pb-8 last:pb-0"
                    >
                      {/* Vertical Line */}
                      {index !== STEPS.length - 1 && (
                        <div
                          className={cn(
                            "absolute left-[11px] top-7 bottom-0 w-[2px]",
                            isCompleted ? "bg-primary" : "bg-muted"
                          )}
                        />
                      )}

                      {/* Icon/Dot */}
                      <div
                        className={cn(
                          "absolute left-0 top-0 h-6 w-6 rounded-full border-2 flex items-center justify-center z-10 bg-background transition-colors duration-300",
                          isCompleted
                            ? "border-primary bg-primary text-primary-foreground"
                            : isCurrent
                            ? "border-primary text-primary"
                            : "border-muted text-muted-foreground"
                        )}
                      >
                        {isCompleted ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <step.icon className="h-3 w-3" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="space-y-1">
                        <p
                          className={cn(
                            "text-sm font-medium leading-none",
                            (isCompleted || isCurrent) && "text-primary",
                            isPending && "text-muted-foreground"
                          )}
                        >
                          {step.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="font-medium bg-muted w-8 h-8 flex items-center justify-center rounded-full text-sm">
                      {item.quantity}x
                    </div>
                    <div>
                      <div className="font-medium">{item.itemName}</div>
                    </div>
                  </div>
                  <div className="font-medium">
                    $
                    {(parseFloat(item.priceAtOrder) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-bold text-lg pt-2">
                <span>Total</span>
                <span>${order.totalAmount}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="block text-muted-foreground">Name</span>
                <span className="font-medium">{order.deliveryName}</span>
              </div>
              <div>
                <span className="block text-muted-foreground">Phone</span>
                <span className="font-medium">{order.deliveryPhone}</span>
              </div>
              <div>
                <span className="block text-muted-foreground">Address</span>
                <span className="font-medium">{order.deliveryAddress}</span>
              </div>
              {order.notes && (
                <div>
                  <span className="block text-muted-foreground">Notes</span>
                  <span className="font-medium">{order.notes}</span>
                </div>
              )}
              <Separator />
              <div>
                <span className="block text-muted-foreground">Placed On</span>
                <span className="font-medium">
                  {format(new Date(order.createdAt), "PPP p")}
                </span>
              </div>
            </CardContent>
          </Card>

          <Button asChild variant="outline" className="w-full">
            <Link href="/orders">Back to Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
