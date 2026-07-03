import { test, expect } from "@playwright/test";
import { writeExcelFile } from "../utils/ExcelUtil";

test("Excel modify test", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");
    let filepath = "C:/Users/hyk68ey/Downloads/download.xlsx"
    await writeExcelFile(filepath, "Apple", "Prathap");
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await page.locator("#fileinput").setInputFiles(filepath);
    await expect(page.locator(".loader")).toBeHidden({ timeout: 15000 });
    expect(page.locator("text = Prathap")).toBeVisible();
})