"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// import { Textarea } from '@/components/ui/textarea'; // we don't have textarea component yet, use input for notes or create it
import { toast } from "sonner";
import { useState } from "react";
import { useCartStore } from "@/store/cart.store";
import { LucideShoppingBasket } from "lucide-react";
import { authClient } from "@/lib/authClient";



export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form state
  // ideally use react-hook-form + zod, but keep simple for now
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const session = authClient.useSession();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="text-5xl mb-4">
          <LucideShoppingBasket />
        </div>
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Button onClick={() => router.push("/menu")}>Browse Menu</Button>
      </div>
    );
  }

  if (!session.data && !session.isPending) {
    router.push("/login?callbackUrl=/checkout");
    return;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            menuItemId: item.menuItem.id,
            quantity: item.quantity,
          })),
          deliveryDetails: formData,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to place order");
      }

      const data = await res.json();
      toast.success("Order placed successfully!");
      clearCart();
      router.push(`/orders/${data.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Input
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Delivery Notes</Label>
                <Input
                  id="notes"
                  placeholder="Apartment number, gate code, etc."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
        <Card>
          <CardContent className="pt-6 space-y-4">
            {items.map((item) => (
              <div
                key={item.menuItem.id}
                className="flex justify-between text-sm"
              >
                <span>
                  {item.quantity}x {item.menuItem.name}
                </span>
                <span>
                  $
                  {(parseFloat(item.menuItem.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Tax (10%)</span>
              <span>${(totalPrice * 0.1).toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${(totalPrice * 1.1).toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              form="checkout-form"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
