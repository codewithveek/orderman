'use client';

import { MenuItemCard } from './menu-item-card';
import { MenuItem } from '@/types';

interface MenuListProps {
    items: MenuItem[];
}

export function MenuList({ items }: MenuListProps) {
    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No items found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
                <MenuItemCard key={item.id} item={item} />
            ))}
        </div>
    );
}
