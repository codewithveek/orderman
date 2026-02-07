'use client';

import { MenuItem } from '@/types'; // We need to define types
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils'; // utility we need
import { useCart } from '@/hooks/use-cart'; // hook we need

// Temporary type until we generate from schema or db
type MenuItemType = {
    id: number;
    name: string;
    description: string;
    price: string;
    imageUrl: string;
    category: string;
    available: boolean; // converted from int(1)
};

interface MenuItemCardProps {
    item: MenuItemType;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
    // const { addItem } = useCart(); // We'll implement this later

    return (
        <Card className="overflow-hidden flex flex-col h-full">
            <div className="relative aspect-video w-full overflow-hidden">
                <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <CardHeader className="p-4">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg line-clamp-1">{item.name}</CardTitle>
                    <span className="font-bold text-primary whitespace-nowrap">
                        ${item.price}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button
                    className="w-full"
                    disabled={!item.available}
                    onClick={() => console.log('Add to cart', item)}
                >
                    {item.available ? 'Add to Cart' : 'Sold Out'}
                </Button>
            </CardFooter>
        </Card>
    );
}
