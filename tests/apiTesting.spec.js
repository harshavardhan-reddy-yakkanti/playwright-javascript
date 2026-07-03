import { test, expect, request } from "@playwright/test"
import { ApiUtils } from "../utils/ApiUtils";

let token;
let apiContext;
let loginPayload = {
        "userEmail": "yharsha0001@gmail.com",
        "userPassword": "Test@12345"
    };

 let cartPayload = {
            "_id": "69f87a8cf86ba51a65a01bea",
            "product": {
                "_id": "6960eae1c941646b7a8b3ed3",
                "productName": "ADIDAS ORIGINAL",
                "productCategory": "electronics",
                "productSubCategory": "mobiles",
                "productPrice": 11500,
                "productDescription": "Apple phone",
                "productImage": "https://rahulshettyacademy.com/api/ecom/uploads/productImage_1767959265156.jpg",
                "productRating": "0",
                "productTotalOrders": "0",
                "productStatus": true,
                "productFor": "women",
                "productAddedBy": "admin",
                "__v": 0
            }
        } 
        
        
test.beforeAll(async () => {
    
    apiContext = await request.newContext({
        ignoreHTTPSErrors: true
    });

})

test.beforeEach(async ({ page }) => {
    let apiUtil = new ApiUtils(apiContext,loginPayload);
    token = await apiUtil.getToken();
    apiUtil.addtoCart(token,cartPayload);
    page.addInitScript(value => {
        window.localStorage.setItem("token", value);
    }, token)

})


test("Api testing", async ({ page }) => {
    let desiredProduct = "iphone 13 pro";
    page.goto("https://rahulshettyacademy.com/client/#/dashboard/cart");

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
        if (rowText.includes(orders[0])) {
            console.log("Order ID found in My Orders: " + rowText);
            testPassed = true;
            break;
        }
        console.log("Order ID verified in My Orders: " + await orderTableRows.nth(i).textContent());
    }
    expect(testPassed).toBeTruthy();

})