import { Header } from '@/components/layout/header';
import { CartProvider } from '@/hooks/use-cart';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CartProvider>
            <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1 container py-6 md:py-10">
                    {children}
                </main>
            </div>
        </CartProvider>
    );
}
