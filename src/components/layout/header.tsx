'use client';

import Link from 'next/link';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        🍕 OrderMan
                    </Link>
                    <nav className="hidden md:flex gap-6">
                        <Link
                            href="/menu"
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === "/menu" ? "text-foreground" : "text-muted-foreground"
                            )}
                        >
                            Menu
                        </Link>
                        <Link
                            href="/orders"
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === "/orders" ? "text-foreground" : "text-muted-foreground"
                            )}
                        >
                            Orders
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <CartDrawer />
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/login">Login</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
