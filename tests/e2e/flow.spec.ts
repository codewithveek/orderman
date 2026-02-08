import { test, expect } from "@playwright/test";

test.describe("Order Flow", () => {
  test("should navigate from home to menu and add item to cart", async ({
    page,
  }) => {
    // 1. Visit Home Page
    await page.goto("/");
    await expect(page).toHaveTitle(/OrderMan/);
    await expect(page.getByText("Delicious Food")).toBeVisible();

    // 2. Navigate to Menu
    await page.getByRole("link", { name: "Order Now" }).click();
    await expect(page).toHaveURL(/.*\/menu/);
    await expect(page.getByRole("heading", { name: "Our Menu" })).toBeVisible();

    // 3. Add Item to Cart
    // Wait for items to load
    const addToCartBtns = page.getByRole("button", { name: "Add to Cart" });
    await expect(addToCartBtns.first()).toBeVisible();

    // Get the name of the first item to verify later
    // Assuming the card has a title.
    // We can traverse up to the card.
    // But let's just click and verify cart count.
    await addToCartBtns.first().click();

    // 4. Verify Cart Badge
    // The badge is inside the cart trigger button.
    // Locate the cart trigger button. It has a ShoppingCart icon (we can't easily select by icon without aria-label).
    // But it's in the header.
    // Let's use a locator for the button with class 'relative' inside header, or just look for the badge text "1".

    // Wait for badge "1" to appear
    await expect(page.locator(".bg-destructive").getByText("1")).toBeVisible();

    // 5. Open Cart Drawer
    // Click the button that contains the badge
    await page.locator(".bg-destructive").getByText("1").click();

    // 6. Verify Cart Content
    await expect(
      page.getByRole("heading", { name: "My Cart (1)" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Checkout" })).toBeVisible();
  });
});
