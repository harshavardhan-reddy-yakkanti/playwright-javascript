import {test,expect} from '@playwright/test';

test("Child window handling", async({browser})=>{
   const context = await browser.newContext();
   const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

    let documentLink = page.locator("a[target='_blank']").first();
    
    const [newPage] = await Promise.all(
    [
           context.waitForEvent("page"),
            documentLink.click(),
        
    ]);
    const text = await newPage.locator(".red").textContent();
    await console.log(text);
    const [t1,t2] = text.split("@");
    console.log(t2.split(" ")[0]);

    await page.locator("#username").fill(t2.split(" ")[0]);
    let combinedText = ["abc","def","ghi"].join("@");
    console.log(combinedText);


});