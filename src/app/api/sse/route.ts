import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { orderRepository } from "@/lib/repositories/order";

// Simple in-memory store for connected clients (not scalable for serverless/multi-instance)
// distinct listeners for each order? or global stream?

// NOTE: Next.js App Router SSE is tricky with serverless timeouts.
// We'll implement a basic simulation loop that runs while the connection is open.

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const orderId = parseInt(searchParams.get("orderId") || "");

  if (!orderId) {
    return new NextResponse("Missing orderId", { status: 400 });
  }

  // Auth check
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const sendEvent = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Send initial status
      const order = await orderRepository.findById(orderId)

      if (!order) {
        controller.close();
        return;
      }

      sendEvent({ status: order.status, timestamp: new Date().toISOString() });

      // Simulation: Advance status every 5 seconds until delivered
      const statuses = [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
      ];
      let currentIndex = statuses.indexOf(order.status);

      const interval = setInterval(async () => {
        if (currentIndex < statuses.length - 1) {
          currentIndex++;
          const newStatus = statuses[currentIndex];

          // Update DB
          await db
            .update(orders)
            .set({
              status: newStatus as
                | "pending"
                | "confirmed"
                | "preparing"
                | "out_for_delivery"
                | "delivered"
                | "cancelled",
            })
            .where(eq(orders.id, orderId));

          sendEvent({ status: newStatus, timestamp: new Date().toISOString() });

          if (newStatus === "delivered") {
            clearInterval(interval);
            controller.close();
          }
        } else {
          clearInterval(interval);
          controller.close();
        }
      }, 5000); // 5 seconds

      // Handle close
      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
