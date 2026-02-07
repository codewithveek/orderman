"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function CartDrawer() {
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.totalItems);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle>My Cart ({totalItems})</SheetTitle>
        </SheetHeader>
        {items.length > 0 ? (
          <>
            <ScrollArea className="flex-1 pr-6 -mr-6">
              <div className="pr-6">
                {items.map((item) => (
                  <CartItem key={item.menuItem.id} item={item} />
                ))}
              </div>
            </ScrollArea>
            <div className="pr-6 pb-6 pt-2">
              <CartSummary />
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-2 pr-6">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/50" />
            <span className="text-lg font-medium text-muted-foreground">
              Your cart is empty
            </span>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
