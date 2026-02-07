'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { SheetClose } from '@/components/ui/sheet';

export function CartSummary() {
    const { totalPrice, items } = useCart();
    const tax = totalPrice * 0.1; // 10% tax
    const total = totalPrice + tax;

    if (items.length === 0) return null;

    return (
        <div className="space-y-4 pt-6">
            <Separator />
            <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
            <SheetClose asChild>
                <Button asChild className="w-full" size="lg">
                    <Link href="/checkout">Checkout</Link>
                </Button>
            </SheetClose>
        </div>
    );
}
