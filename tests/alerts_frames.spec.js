import {test,expect} from "@playwright/test"


test("@Smoke Alerts testing", async ({page}) =>{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    let text_example = page.locator("#displayed-text");
    await expect(text_example).toBeVisible();
    let hide_button = page.locator("#hide-textbox");
    await hide_button.click();
    await expect(text_example).toBeHidden();
    let show_button = page.locator("#show-textbox");
    await show_button.click();
    await expect(text_example).toBeVisible();

})

test("alerts", async({page}) =>{
        await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
        page.on("dialog", async dialog =>{
            console.log("Alert message: "+dialog.message());
            await dialog.accept();
        })
        await page.locator("#confirmbtn").click();
})

test("Frames", async({page}) =>{
     await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
     let frame = await page.frameLocator("#courses-iframe");
     await frame.locator('[href*="com/courses"]').first().click();
     await expect(frame.getByPlaceholder("Search product names")).toBeVisible();


    
})