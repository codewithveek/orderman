"use client";

import { MenuItem } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Card className="group overflow-hidden flex flex-col h-full border-muted/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!item.available && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm">
            <span className="font-bold text-destructive text-lg border-2 border-destructive px-4 py-1 rounded-md -rotate-12">
              SOLD OUT
            </span>
          </div>
        )}
      </div>
      <CardHeader className="p-5 pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
            {item.name}
          </CardTitle>
          <span className="font-bold text-lg text-primary whitespace-nowrap bg-primary/10 px-2 py-0.5 rounded-md">
            {formatCurrency(item.price)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button
          className="w-full font-semibold shadow-sm group-hover:shadow-md transition-all active:scale-95"
          size="lg"
          disabled={!item.available}
          onClick={() => addItem(item)}
        >
          {item.available ? "Add to Cart" : "Unavailable"}
        </Button>
      </CardFooter>
    </Card>
  );
}
