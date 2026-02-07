import "dotenv/config";
import dotenv from "dotenv";
import path from "path";

// Load .env.local explicitly
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function seed() {
  console.log("🌱 Seeding database...");

  // Dynamic imports to ensure env vars are loaded first
  const { menuRepository } = await import("@/lib/repositories/menu");
  const { db } = await import("@/lib/db");
  const { menuItems } = await import("@/lib/db/schema");

  const sampleItems = [
    {
      name: "Classic Cheeseburger",
      description:
        "Juicy beef patty with cheddar cheese, lettuce, tomato, and our secret sauce.",
      price: "12.99",
      imageUrl:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=60",
      category: "burgers",
      available: true,
    },
    {
      name: "Bacon BBQ Burger",
      description:
        "Beef patty topped with crispy bacon, onion rings, and smokey BBQ sauce.",
      price: "14.99",
      imageUrl:
        "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&auto=format&fit=crop&q=60",
      category: "burgers",
      available: true,
    },
    {
      name: "Margherita Pizza",
      description: "Classic tomato sauce, fresh mozzarella, and basil.",
      price: "10.99",
      imageUrl:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=60",
      category: "pizzas",
      available: true,
    },
    {
      name: "Pepperoni Feast",
      description: "Double pepperoni and extra mozzarella cheese.",
      price: "13.99",
      imageUrl:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format&fit=crop&q=60",
      category: "pizzas",
      available: true,
    },
    {
      name: "Crispy Fries",
      description: "Golden fries seasoned with sea salt.",
      price: "4.99",
      imageUrl:
        "https://images.unsplash.com/photo-1606755456206-b25206cde27e?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "sides",
      available: true,
    },
    {
      name: "Onion Rings",
      description: "Beer-battered onion rings served with ranch dip.",
      price: "5.99",
      imageUrl:
        "https://images.unsplash.com/photo-1639024471283-03518883512d?w=800&auto=format&fit=crop&q=60",
      category: "sides",
      available: true,
    },
    {
      name: "Cola",
      description: "Ice cold cola.",
      price: "2.50",
      imageUrl:
        "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=60",
      category: "drinks",
      available: true,
    },
    {
      name: "Lemonade",
      description: "Freshly squeezed lemonade.",
      price: "3.50",
      imageUrl:
        "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=60",
      category: "drinks",
      available: true,
    },
  ];

  try {
    // Clear existing menu items
    await db.delete(menuItems);
    console.log("Deleted existing menu items");

    // Insert new items
    for (const item of sampleItems) {
      await menuRepository.create(item);
    }

    console.log("✅ Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
