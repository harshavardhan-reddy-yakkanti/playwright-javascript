import {test,expect,request} from "@playwright/test"
import {ApiUtils} from "../utils/ApiUtils";

let token;
let apiContext;
let orderId;
let loginPayload = {
        "userEmail": "yharsha0001@gmail.com",
        "userPassword": "Test@12345"
    };

    let cartPayload = {
    "orders": [
        {
            "country": "India",
            "productOrderedId": "6960eac0c941646b7a8b3e68"
        }
    ]
}

let fakePayload = {
    data : [],
    message : "No orders found for this user."
}


test.beforeAll(async () => {
    
    apiContext = await request.newContext({
        ignoreHTTPSErrors: true
    });

})

test.beforeEach(async ({ page }) => {
    let apiUtil = new ApiUtils(apiContext,loginPayload);
    token = await apiUtil.getToken();
    orderId = await apiUtil.placeOrder(token,cartPayload);
    page.addInitScript(value => {
        window.localStorage.setItem("token", value);
    }, token)
})


test("@Smoke Intercept API", async({page}) =>{
    await page.goto("https://rahulshettyacademy.com/client")


    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*", async route =>
        {
          const response =   await apiContext.fetch(route.request());
          console.log("Original response: "+ JSON.stringify(await response.json()));
          let body = fakePayload;
          route.fulfill({
            // response,
            body: JSON.stringify(body)
          })
    })
    
    await page.goto("https://rahulshettyacademy.com/client/#/dashboard/myorders");
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");

    let text = await page.getByText('You have No Orders to show at').textContent();
    expect(text).toContain("You have No Orders to show at this time.");
})


test("Api security testing", async ({ page }) => {

    await page.goto("https://rahulshettyacademy.com/client/#/dashboard/myorders");
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*", async route =>
        route.continue({
            url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=12345"
        })
    )


    await page.getByRole('button', { name: 'View' }).first().click();
    await page.pause();


})

test("abort calls", async ({ page }) => {

    
    page.route("https://rahulshettyacademy.com/api/ecom/uploads/*",route =>
        route.abort()
    )
     page.on('request', request => {
    console.log(request.url());
});
    await page.goto("https://rahulshettyacademy.com/client/#/dashboard/dash");
    
    await page.locator("text = Add To Cart").first().waitFor();
    await page.pause();
})

