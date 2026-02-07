"use client";

import Link from "next/link";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/authClient";
import { Loader2, LogOut, User } from "lucide-react";
import { toast } from "sonner";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const session = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully");
          router.push("/login");
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            🍕 OrderMan
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/menu"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/menu"
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              Menu
            </Link>
            <Link
              href="/orders"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/orders"
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              Orders
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <CartDrawer />
          {session.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : session.data ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden sm:inline-block">
                  {session.data.user.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
