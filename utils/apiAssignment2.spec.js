import { test, expect, request } from "@playwright/test"
import { get } from "http";


const BASE_URL = "https://eventhub.rahulshettyacademy.com"
const API_URL = BASE_URL + "/api";
const email1 = "dummy10@gmail.com";
const password = "Test@12345";
const email2 = "dummy20@gmail.com";
let loginBody = {
    "email": email1,
    "password": password
}

test("Api test 3", async ({ page }) => {
    const apiContext = await request.newContext({
        ignoreHTTPSErrors: true
    });

    let loginResponse = await apiContext.post("https://api.eventhub.rahulshettyacademy.com/api/auth/login",
        {
            data: loginBody
        });

    console.log("Status code: " + loginResponse.status());

    await expect(loginResponse.ok()).toBeTruthy();

    let jsonResponse = await loginResponse.json();
    let token = await jsonResponse.token;
    console.log("Token: " + token);

    let getHeaders = {
        "Authorization": "Bearer " + token
    }

    let getEvent = await apiContext.fetch("https://api.eventhub.rahulshettyacademy.com/api/events/1",
        {
            headers: getHeaders
        }
    );

    console.log("Get event status code: " + getEvent.status());
    await expect(getEvent.ok()).toBeTruthy();

    let bookingBody = {
        "eventId": 1,
        "customerName": "Priya Sharma",
        "customerEmail": email1,
        "customerPhone": "+91-9876543210",
        "quantity": 1
    }

    let bookingResponse = await apiContext.post("https://api.eventhub.rahulshettyacademy.com/api/bookings",
        {
            data: bookingBody,
            headers: getHeaders
        }
    )
    await expect((bookingResponse).ok()).toBeTruthy();
    let bookingJsonResponse = await bookingResponse.json();
    let yahooBookingId = await bookingJsonResponse.data.id;
    console.log("Yahoo Id: "+yahooBookingId);

    await page.goto("https://eventhub.rahulshettyacademy.com/login");
    //await page.pause();
    await page.locator("#email").fill(email2);
    await page.locator("#password").fill(password);
    
await Promise.all([
    page.waitForNavigation(), // waits for login redirect
    page.locator("#login-btn").click()
]);

    await page.goto("https://eventhub.rahulshettyacademy.com/bookings/"+yahooBookingId);
    await expect(page.locator("text = Access Denied")).toBeVisible();

})