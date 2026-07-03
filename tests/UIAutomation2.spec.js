import { test, expect } from '@playwright/test';

let webContext;
test.beforeAll(async({browser})=>{
let emailId = "yharsha0001@gmail.com";
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await page.locator("#userEmail").fill(emailId);
    await page.locator("#userPassword").fill("Test@12345");
    await page.locator("#login").click();
    await page.waitForLoadState("domcontentloaded");
    let products = page.locator(".card-body");
    await products.first().waitFor();
    await context.storageState({path: "state.json"});
    webContext = await browser.newContext({storageState:"state.json"});
    
})


test("Simlpe flow", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await page.locator("#userEmail").fill("yharsha0001@gmail.com");
    await page.locator("#userPassword").fill("Test@12345");
    await page.locator("#login").click();
    await expect(page).toHaveTitle("Let's Shop");
    let productNames = page.locator(".card-body h5 b");
    productNames.waitFor();
    await page.waitForLoadState("domcontentloaded");
    console.log(await productNames.allTextContents());

});

test("UI controls", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    await page.locator("#username").fill("rahulshettyacademy");
    await page.locator("#password").fill("learning");
    let usertype = page.locator("#usertype");
    await usertype.last().click();
    await expect(usertype.last()).toBeChecked();
    let okayBtn = page.locator("#okayBtn");
    await okayBtn.click();
    let terms = page.locator("#terms");
    await terms.click();
    expect(await terms.isChecked()).toBeTruthy();
    await terms.uncheck();
    expect(await terms.isChecked()).toBeFalsy();
    let dropdown = page.locator("select.form-control");
    await dropdown.selectOption("consult");
    console.log(await dropdown.inputValue());

});

test("Child window handling", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    let documentLink = page.locator("a[target='_blank']").first();
    await documentLink.click();


    const pages = context.pages();
    const childPage = pages[1];
    await childPage.waitForLoadState();
    console.log(await childPage.locator(".red").textContent());
});


test("End to end flow", async () => {
    let desiredProduct = "iphone 13 pro";
    const page = await webContext.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    await page.waitForLoadState("domcontentloaded");
    let products = page.locator(".card-body");
    await products.first().waitFor();
    let productCount = await products.count();
    console.log("Total products: " + productCount);
    for (let i = 0; i < await productCount; i++) {
        await console.log("Product name: " + await products.nth(i).locator("h5 b").textContent());
        if (await products.nth(i).locator("h5 b").textContent() === desiredProduct) {
            await products.nth(i).locator("text= Add To Cart").click();
            console.log("Product added to cart: " + await products.nth(i).locator("h5 b").textContent());
            break;
        }
    }

    let cart = page.locator("[routerlink*='cart']");
    await cart.click();
    let cartItems = page.locator(".cartSection h3");
    for (let i = 0; i < await cartItems.count(); i++) {
        if (await cartItems.nth(i).textContent() === desiredProduct) {
            console.log("Product is present in cart: " + await cartItems.nth(i).textContent());
            break;
        }
    }
    let checkoutBtn = page.locator("text=Checkout");
    await checkoutBtn.click();
    const fields = page.locator('div.field');
    const count = await fields.count();

    for (let i = 0; i < count; i++) {

        const field = fields.nth(i);

        const title = await field.locator('.title').textContent();

        if (title.includes('CVV')) {

            await field.locator('input').fill('123');
        }
        if (title.includes('Name on Card')) {

            await field.locator('input').fill('Harsha Vardhan');
        }
    }

    let countryInput = page.locator("[placeholder='Select Country']");
    await countryInput.pressSequentially("Ind", { delay: 250 });
    let countryOptions = page.locator(".ta-results button");
    await countryOptions.first().waitFor();
    for (let i = 0; i < await countryOptions.count(); i++) {
        if (await countryOptions.nth(i).textContent() === " India") {
            await countryOptions.nth(i).click();
            console.log("Country selected: India");
            break;
        }
    }

    let placeOrderBtn = page.locator("text=Place Order ");
    await placeOrderBtn.click();
    let orderConfirmation = page.locator(".hero-primary");
    await expect(orderConfirmation).toHaveText("Thankyou for the order.");

    let orderIds = page.locator("tr.ng-star-inserted label");
    let orders = new Array();
    for (let i = 0; i < await orderIds.count(); i++) {
       const orderText = await orderIds.nth(i).textContent();
        const cleanOrderId = orderText.replace(/\|/g, "").trim();
        orders.push(cleanOrderId);
        break;
    }
    
    console.log("Order ID stored for verification: " + orders[0]);
    let myOrdersBtn = page.locator("[routerlink='/dashboard/myorders']");
    await myOrdersBtn.first().click();
    let orderTableRows = page.locator("tbody tr th");
    await orderTableRows.first().waitFor();
    let testPassed = false;
    for (let i = 0; i < await orderTableRows.count(); i++) {
        let rowText = await orderTableRows.nth(i).textContent();
        if(rowText.includes(orders[0])){
            console.log("Order ID found in My Orders: " + rowText);
            testPassed = true;
            break;
        }
       console.log("Order ID verified in My Orders: " + await orderTableRows.nth(i).textContent());
    }
    expect(testPassed).toBeTruthy();





})