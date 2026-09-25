import { test, expect } from "@playwright/test";
import { FEATURES } from "../lib/features";

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL || "admin@atouts-services.fr";
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD || "admin123";

test.describe("Admin journey (p5-19)", () => {
  test("Login page loads", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();
    await expect(page.getByRole("button", { name: /connexion|login/i })).toBeVisible();
  });

  test("Login and access dashboard", async ({ page }) => {
    await page.goto("/admin/login");
    await page.locator("input[type='email']").fill(ADMIN_EMAIL);
    await page.locator("input[type='password']").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: /connexion|login/i }).click();

    // Should redirect to dashboard
    await page.waitForURL("**/admin/dashboard", { timeout: 10000 });
    await expect(page).toHaveURL(/admin\/dashboard/);
  });

  test.describe("Authenticated admin pages", () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.goto("/admin/login");
      await page.locator("input[type='email']").fill(ADMIN_EMAIL);
      await page.locator("input[type='password']").fill(ADMIN_PASSWORD);
      await page.getByRole("button", { name: /connexion|login/i }).click();
      await page.waitForURL("**/admin/dashboard", { timeout: 10000 });
    });

    test("Dashboard shows stats", async ({ page }) => {
      await expect(page.locator("text=Portfolio")).toBeVisible();
    });

    test("Portfolio page loads", async ({ page }) => {
      await page.goto("/admin/portfolio");
      await expect(page.getByText(/portfolio/i).first()).toBeVisible();
      // Add button should exist
      await expect(page.getByRole("button", { name: /ajouter/i })).toBeVisible();
    });

    test("Before/After page loads", async ({ page }) => {
      await page.goto("/admin/before-after");
      await expect(page.getByRole("button", { name: /ajouter/i })).toBeVisible();
    });

    test("Quotes page loads with filters and CSV export", async ({ page }) => {
      await page.goto("/admin/quotes");
      // CSV export button
      await expect(page.getByRole("button", { name: /csv|exporter/i })).toBeVisible();
    });

    test("Blog page loads", async ({ page }) => {
      await page.goto("/admin/blog");
      await expect(page.getByRole("button", { name: /nouvel|ajouter/i })).toBeVisible();
    });

    test("Testimonials page loads", async ({ page }) => {
      await page.goto("/admin/testimonials");
      await expect(page.getByRole("button", { name: /nouvel|ajouter/i })).toBeVisible();
    });

    test("Simulator admin page loads", async ({ page }) => {
      test.skip(!FEATURES.simulator, "Simulator disabled in lib/features.ts");
      await page.goto("/admin/simulator");
      await expect(page.getByText(/tarifs|leads/i).first()).toBeVisible();
    });

    test("Projects page loads", async ({ page }) => {
      await page.goto("/admin/projects");
      await expect(page).toHaveURL(/admin\/projects/);
    });

    test("Payments page loads", async ({ page }) => {
      await page.goto("/admin/payments");
      await expect(page).toHaveURL(/admin\/payments/);
    });

    test("Analytics page loads", async ({ page }) => {
      await page.goto("/admin/analytics");
      await expect(page).toHaveURL(/admin\/analytics/);
    });
  });
});
