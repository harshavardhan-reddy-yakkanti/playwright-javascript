import {test,expect} from "@playwright/test"

test("Visual Testing", async ({page}) => {
    await page.goto("https://staging.d1m26rxf2ish6y.amplifyapp.com");
    await expect(page.locator("text = Master real-world skills with curated courses. Build smarter, stand out.")).toBeVisible();
    await expect(await page.screenshot()).toMatchSnapshot("screenshot.png");
    await page.getByRole("link", {name : "Login"}).click();
    await expect(page.getByRole("heading", {name : "Sign in"})).toBeVisible();
    await page.getByRole("heading",{name : "Sign in"}).screenshot({path : "Element_Screenshot.png"});

})