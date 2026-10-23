import { expect, test } from "@playwright/test";

const sections = [
  { label: "Simulation", path: "/simulation" },
  { label: "Comparateur", path: "/comparateur" },
  { label: "Quartiers", path: "/quartiers" },
  { label: "Annonces", path: "/annonces" },
  { label: "Portefeuille", path: "/portefeuille" },
  { label: "Roadmap", path: "/roadmap" },
  { label: "Conseiller IA", path: "/conseiller" },
  { label: "Paramètres", path: "/parametres" },
];

test("redirects the root to the dashboard", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/dashboard$/);
});

test.describe("desktop navigation", () => {
  test.skip(({ isMobile }) => isMobile, "Sidebar is desktop-only");

  test("every sidebar link reaches its page", async ({ page }) => {
    await page.goto("/dashboard");
    const sidebar = page.getByRole("complementary", { name: "Navigation principale" });
    for (const section of sections) {
      await sidebar.getByRole("link", { name: section.label }).click();
      await expect(page).toHaveURL(new RegExp(`${section.path}$`));
      await expect(page.getByRole("heading", { level: 1, name: section.label })).toBeVisible();
    }
  });

  test("command palette navigates with the keyboard", async ({ page }) => {
    await page.goto("/dashboard");
    await page.keyboard.press("ControlOrMeta+k");
    const palette = page.getByRole("dialog", { name: "Palette de commandes" });
    await expect(palette).toBeVisible();
    await page.keyboard.type("quartiers");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/quartiers$/);
    await expect(palette).toBeHidden();
  });

  test("G then S shortcut opens the simulation", async ({ page }) => {
    await page.goto("/dashboard");
    await page.locator("main").click({ position: { x: 5, y: 5 } });
    await page.keyboard.press("g");
    await page.keyboard.press("s");
    await expect(page).toHaveURL(/\/simulation$/);
  });

  test("sidebar collapse persists across reloads", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("button", { name: "Replier la barre latérale" }).click();
    await page.reload();
    await expect(page.getByRole("button", { name: "Déplier la barre latérale" })).toBeVisible();
  });
});

test.describe("mobile navigation", () => {
  test.skip(({ isMobile }) => !isMobile, "Tab bar is mobile-only");

  test("tab bar and drawer reach every section", async ({ page }) => {
    await page.goto("/dashboard");
    await page
      .getByRole("navigation", { name: "Navigation rapide" })
      .getByRole("link", { name: "Quartiers" })
      .click();
    await expect(page).toHaveURL(/\/quartiers$/);

    await page.getByRole("button", { name: "Ouvrir la navigation" }).click();
    await page
      .getByRole("dialog")
      .getByRole("link", { name: /Roadmap/ })
      .click();
    await expect(page).toHaveURL(/\/roadmap$/);
  });
});

test("theme can be switched to dark", async ({ page }) => {
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Passer en mode sombre" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
});
