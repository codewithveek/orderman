import { Header } from '@/components/layout/header';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-6 md:py-10">
                {children}
            </main>
        </div>
    );
}
