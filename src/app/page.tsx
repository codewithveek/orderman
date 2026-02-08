import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, UtensilsCrossed } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4 py-20 bg-linear-to-b from-background to-muted/20">
        <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10 text-primary animate-pulse">
              <UtensilsCrossed size={48} />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Delicious Food, <br /> Delivered to Your Doorstep
          </h1>
          <p className="text-xl text-muted-foreground md:w-3/4 mx-auto">
            Experience the best flavors in town. Freshly prepared, hot, and
            ready to satisfy your cravings.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button
              asChild
              size="lg"
              className="gap-2 text-lg h-12 px-8 shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/menu">
                Order Now <ArrowRight size={20} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Basic Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-muted-foreground">
              We ensure your food arrives hot and fresh within 30 minutes.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🥗</div>
            <h3 className="text-xl font-semibold mb-2">Fresh Ingredients</h3>
            <p className="text-muted-foreground">
              We use only the finest locally sourced ingredients.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">💝</div>
            <h3 className="text-xl font-semibold mb-2">Made with Love</h3>
            <p className="text-muted-foreground">
              Our chefs prepare every meal with passion and care.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
