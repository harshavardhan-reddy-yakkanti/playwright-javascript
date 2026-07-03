import { test,expect } from '@playwright/test';

test('UI Basics', async ({browser})=>{

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    await page.locator("#username").fill("rahulshettyacademy");
    await page.locator("#password").fill("learning");
    await page.locator("#usertype").first().click();
    await page.locator("#terms").click();
    await page.locator("#signInBtn").click();
    let errormsg = await page.locator("[style='display: block;']").textContent();
    await console.log(errormsg);
    await expect(page.locator("[style='display: block;']")).toContainText("password");
    await page.locator("#password").fill("");
    await page.locator("#password").fill("Learning@830$3mK2)");
    await page.locator("#signInBtn").click();
    await page.locator("#okayBtn").click();
});

test("title validation testing", async({page})=>
{
    await page.goto("https://google.com");
    await console.log(page.title());
    await expect(page).toHaveTitle("Google");

});