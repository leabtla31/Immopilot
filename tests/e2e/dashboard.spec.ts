import { expect, test } from "@playwright/test";

test.describe("dashboard", () => {
  test("shows the greeting, net worth and key figures", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { level: 1, name: /Bonjour Léa/ })).toBeVisible();
    await expect(page.getByText("102 000 €").first()).toBeAttached();
    await expect(page.getByText("Arno", { exact: false }).first()).toBeVisible();
    for (const label of [
      "Capacité d'emprunt",
      "Apport mobilisable",
      "Cash disponible",
      "Liberté financière",
    ]) {
      await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
    }
  });

  test("renders the goals as accessible meters", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByRole("meter", { name: /Premier million/ })).toBeVisible();
    await expect(page.getByRole("meter")).toHaveCount(4);
  });

  test("surfaces the AI suggestion and the next step", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByText("Suggestion IA")).toBeVisible();
    await expect(page.getByText(/Résidence principale 2032 : endettement/)).toBeVisible();
    await expect(page.getByText(/Prochaine étape · 2027/)).toBeVisible();
  });

  test("lets the user change the chart horizon", async ({ page }) => {
    await page.goto("/dashboard");
    const range = page.getByRole("radiogroup", { name: "Horizon du graphique" });
    await range.getByRole("radio", { name: "5 ans" }).click();
    await expect(range.getByRole("radio", { name: "5 ans" })).toBeChecked();
    await expect(page.locator(".recharts-xAxis").getByText("2031")).toBeVisible();
    await expect(page.locator(".recharts-xAxis").getByText("2045")).toHaveCount(0);
  });

  test("next step links to the listings", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("link", { name: /Analyser les annonces/ }).click();
    await expect(page).toHaveURL(/\/annonces$/);
  });
});
