import { test, expect, devices } from "@playwright/test";
import { FEATURES } from "../lib/features";

test.use(devices["Pixel 7"]);

test.describe("Mobile user journey (p5-20)", () => {
  test("Homepage loads on mobile", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Atouts Services/);

    // Hero should be visible
    await expect(page.locator("section").first()).toBeVisible();
  });

  test("Mobile menu opens and navigates", async ({ page }) => {
    await page.goto("/");

    // Desktop nav should be hidden, mobile menu button visible
    const menuButton = page.getByLabel(/ouvrir le menu|menu/i);
    await expect(menuButton).toBeVisible();

    // Open mobile menu
    await menuButton.click();

    // Mobile nav should appear
    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu).toBeVisible();

    // Should have navigation links
    await expect(mobileMenu.getByText(/accueil/i)).toBeVisible();
  });

  test("Sticky mobile CTA is visible", async ({ page }) => {
    await page.goto("/");

    // Scroll down to trigger sticky CTA
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);

    // The sticky CTA bar should be visible on mobile
    const cta = page.locator(".fixed.bottom-0");
    await expect(cta).toBeVisible();
  });

  test("Services page on mobile shows stack layout", async ({ page }) => {
    await page.goto("/");

    // On mobile, services should use the stack layout (md:hidden)
    const mobileServices = page.locator("#services .md\\:hidden");
    await expect(mobileServices).toBeVisible();
  });

  test("Quote form works on mobile", async ({ page }) => {
    await page.goto("/");

    // Scroll to contact
    await page.locator("#contact").scrollIntoViewIfNeeded();

    // Step 1: Select service
    const serviceButton = page.getByRole("radio", { name: /peinture/i });
    await serviceButton.click();

    // Navigate through steps
    await page.getByRole("button", { name: /suivant/i }).click();

    // Step 2: Fill surface
    await page.locator("#surface_area").fill("40");
    await page.getByRole("button", { name: /suivant/i }).click();

    // Step 3: Contact info
    await page.locator("#first_name").fill("Mobile");
    await page.locator("#last_name").fill("Test");
    await page.locator("#email").fill("mobile@test.com");
    await page.locator("#phone").fill("06 00 00 00 00");
    await page.getByRole("button", { name: /suivant/i }).click();

    // Step 4: Submit button visible
    await expect(page.getByRole("button", { name: /envoyer/i })).toBeVisible();
  });

  test("Legal pages render on mobile", async ({ page }) => {
    await page.goto("/mentions-legales");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("Simulator page works on mobile", async ({ page }) => {
    test.skip(!FEATURES.simulator, "Simulator disabled in lib/features.ts");
    await page.goto("/simulateur");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("Phone CTA button is accessible", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);

    const phoneButton = page.getByLabel(/appeler/i);
    await expect(phoneButton).toBeVisible();
  });
});
