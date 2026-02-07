import { MenuFilters } from '@/components/menu/menu-filters';
import { MenuList } from '@/components/menu/menu-list';
import { menuRepository } from '@/lib/repositories/menu';

// Force dynamic to ensure fresh data if we add admin features later
export const dynamic = 'force-dynamic';

export default async function MenuPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const params = await searchParams
    const category = params.category;

    let items;
    if (category && category !== 'all') {
        items = await menuRepository.findByCategory(category);
    } else {
        items = await menuRepository.findAll();
    }

    // Transform to match MenuItem type (available is 0/1 in db, boolean in type)
    const formattedItems = items.map(item => ({
        ...item,
        price: item.price.toString(), // ensure string

    }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Our Menu</h1>
                <p className="text-muted-foreground">
                    Choose from our delicious selection of dishes.
                </p>
            </div>

            <MenuFilters />
            <MenuList items={formattedItems} />
        </div>
    );
}
