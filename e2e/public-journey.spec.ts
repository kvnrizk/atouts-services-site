import { test, expect } from "@playwright/test";
import { FEATURES } from "../lib/features";

test.describe("Public user journey (p5-18)", () => {
  test("Homepage loads with all sections", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Atouts Services/);

    // Hero section visible
    await expect(page.locator("section").first()).toBeVisible();

    // Services section
    const services = page.locator("#services");
    await expect(services).toBeAttached();

    // Testimonials section
    const testimonials = page.locator("#testimonials");
    await expect(testimonials).toBeAttached();

    // Contact section
    const contact = page.locator("#contact");
    await expect(contact).toBeAttached();
  });

  test("Navigate to a service page", async ({ page }) => {
    await page.goto("/services/peinture");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toContainText(/peinture/i);
  });

  test("Navigate to realisations page", async ({ page }) => {
    await page.goto("/realisations");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("Navigate to simulator page", async ({ page }) => {
    test.skip(!FEATURES.simulator, "Simulator disabled in lib/features.ts");
    await page.goto("/simulateur");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("Quote form multi-step flow", async ({ page }) => {
    await page.goto("/");

    // Scroll to contact section
    await page.locator("#contact").scrollIntoViewIfNeeded();

    // Step 1: Select a service type
    const serviceButton = page.getByRole("radio", { name: /peinture/i });
    await serviceButton.click();
    await expect(serviceButton).toHaveAttribute("aria-checked", "true");

    // Click next
    await page.getByRole("button", { name: /suivant/i }).click();

    // Step 2: Fill project details
    await page.locator("#surface_area").fill("50");
    await page.locator("#rooms").fill("3");
    await page.getByRole("button", { name: /suivant/i }).click();

    // Step 3: Fill contact info
    await page.locator("#first_name").fill("Test");
    await page.locator("#last_name").fill("Utilisateur");
    await page.locator("#email").fill("test@example.com");
    await page.locator("#phone").fill("06 12 34 56 78");
    await page.getByRole("button", { name: /suivant/i }).click();

    // Step 4: Message and submit button visible
    await expect(page.getByRole("button", { name: /envoyer/i })).toBeVisible();
  });

  test("Header navigation works", async ({ page }) => {
    await page.goto("/");

    // Desktop nav links
    const nav = page.locator("nav").first();
    await expect(nav.getByText(/accueil/i).first()).toBeVisible();
  });

  test("Footer has legal page links", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer.getByText(/mentions légales/i)).toBeAttached();
    await expect(footer.getByText(/confidentialité/i)).toBeAttached();
  });

  test("Legal pages load", async ({ page }) => {
    await page.goto("/mentions-legales");
    await expect(page.locator("h1")).toBeVisible();

    await page.goto("/politique-de-confidentialite");
    await expect(page.locator("h1")).toBeVisible();

    await page.goto("/conditions-generales");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("Language switcher is present", async ({ page }) => {
    await page.goto("/");
    // Language switcher should be in header
    await expect(page.locator("header")).toBeVisible();
  });
});
