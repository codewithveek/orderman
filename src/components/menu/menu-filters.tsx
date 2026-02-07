'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // Need to ensure utils is created (yes I did)

const CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'pizza', label: 'Pizza' },
    { id: 'burger', label: 'Burger' },
    { id: 'sushi', label: 'Sushi' },
    { id: 'pasta', label: 'Pasta' },
    { id: 'dessert', label: 'Dessert' },
    { id: 'drinks', label: 'Drinks' },
];

export function MenuFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category') || 'all';

    const handleCategoryChange = (categoryId: string) => {
        const params = new URLSearchParams(searchParams);
        if (categoryId === 'all') {
            params.delete('category');
        } else {
            params.set('category', categoryId);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap gap-2 pb-4 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((category) => (
                <Button
                    key={category.id}
                    variant={currentCategory === category.id || (currentCategory === 'all' && category.id === 'all') ? 'default' : 'outline'}
                    className={cn(
                        "rounded-full whitespace-nowrap",
                        currentCategory === category.id && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => handleCategoryChange(category.id)}
                >
                    {category.label}
                </Button>
            ))}
        </div>
    );
}
