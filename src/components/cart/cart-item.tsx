"use client";

import { CartItem as CartItemType } from "@/types";
import { useCartStore } from "@/store/cart.store";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex gap-4 py-4">
      <div className="relative aspect-square h-20 w-20 min-w-20 overflow-hidden rounded-md border">
        <Image
          src={item.menuItem.imageUrl}
          alt={item.menuItem.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between">
          <h3 className="font-medium text-sm line-clamp-2">
            {item.menuItem.name}
          </h3>
          <p className="font-medium text-sm ml-2">
            ${(parseFloat(item.menuItem.price) * item.quantity).toFixed(2)}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 border rounded-md p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() =>
                updateQuantity(item.menuItem.id, item.quantity - 1)
              }
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-xs w-4 text-center">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() =>
                updateQuantity(item.menuItem.id, item.quantity + 1)
              }
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => removeItem(item.menuItem.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
