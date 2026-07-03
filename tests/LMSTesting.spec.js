import { test, expect, request } from '@playwright/test';

test('LMS testing', async ({ page }) => {


    let apiContext = await request.newContext({
        ignoreHTTPSErrors: true
    });

    await page.route("**/*/create-order", async route => {
        console.log("INTERCEPTING CREATE ORDER API\n ==================================================================");
        const response = await apiContext.fetch(route.request());
        console.log("Original response: " + JSON.stringify(await response.json()));
        let body = await response.json();
        console.log("Body without modifying: " + JSON.stringify(body));
        body.amount = 100;
        console.log("Modified response: " + JSON.stringify(body));
        await route.fulfill({
            response,
            body: JSON.stringify(body)
        })
    })

    await page.route("https://api.razorpay.com/v1/standard_checkout/checkout/order?key_id*", async route => {
        console.log("INTERCEPTED RAZORPAY API\n ====================================");
        const response = await apiContext.fetch(route.request());
        console.log("Original response: " + JSON.stringify(await response.json()));
        let body = await response.json();
        console.log("Body without modifying: " + JSON.stringify(body));
        body.qr_code.payment_amount = 100;
        body.qr_code.payments_amount_received = 100;
        body.qr_code.payments_count_received = 1;
        body.request.url = "test";

        let imageContent = body.qr_code.image_content;
        imageContent = imageContent.replace("12","1");
        body.qr_code.image_content = imageContent;
        console.log("Modified response: " + JSON.stringify(body));
        await route.fulfill({
            response,
            body: JSON.stringify(body)
        })
    })

    await page.route("https://api.razorpay.com/v1/checkout/qr_code/**", async route => {
        console.log("INTERCEPTING QR CODE API\n ====================================");
        const response = await apiContext.fetch(route.request());
        console.log("Original response: " + JSON.stringify(await response.json()));
        let body = await response.json();
        console.log("Body without modifying: " + JSON.stringify(body));
        body.status = "processed";
    
        console.log("Modified response: " + JSON.stringify(body));
        await route.fulfill({
            response,
            body: JSON.stringify(body)
        })
    })

    await page.goto('https://staging.d1m26rxf2ish6y.amplifyapp.com/');
    await expect(page.getByRole('link', { name: 'Telusko' })).toBeVisible();

    await page.getByRole('link', { name: 'Login' }).click();
    await expect(page.locator('form').filter({ hasText: 'Sign inForgot password?' }).getByLabel('Continue with Google')).toBeVisible();

    await page.locator('form').filter({ hasText: 'Sign inForgot password?' }).getByPlaceholder('Email').click();
    await page.locator('form').filter({ hasText: 'Sign inForgot password?' }).getByPlaceholder('Email').fill('yharsha0001@gmail.com');
    await page.locator('form').filter({ hasText: 'Sign inForgot password?' }).getByPlaceholder('Password').click();
    await page.locator('form').filter({ hasText: 'Sign inForgot password?' }).getByPlaceholder('Password').fill('Test@12345');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('link', { name: 'Telusko' })).toBeVisible();
    await page.getByRole('link', { name: 'Enroll' }).first().click();
    await expect(page.getByRole('link', { name: 'Back to course' })).toBeVisible();

    await page.locator('div').filter({ hasText: /^vnmkjl, fghjnkml,Hyderabad, Telangana — 504103 India$/ }).first().click();
    await page.pause();
    await page.getByRole('button', { name: 'Buy Now · ₹' }).click();
    await page.waitForResponse("**/*create-order");

    
});

function updateAllPreviewFields(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(updateAllPreviewFields);
  } else if (obj && typeof obj === "object") {
    for (const key of Object.keys(obj)) {
      if (key === "is_preview") {
        obj[key] = true;
      } else {
        updateAllPreviewFields(obj[key]);
      }
    }
  }
}

test("Unauthorized testing", async ({ page }) => {

let apiContext = await request.newContext({
        ignoreHTTPSErrors: true
    });

    let getCoursePayload = [
    {
        "id": "3962debd-62fd-46a2-b368-d4af71ef9591",
        "user_id": "dca32ed6-1290-4c68-82d3-f3cb4c028f35",
        "course_id": "e88185be-be1f-40d6-a414-2ea6b3e57f21",
        "course_title": "sdfsdfasdf",
        "course_slug": "sdfsdfasdf",
        "course_thumbnail_url": null,
        "status": "active",
        "enrollment_status": "active",
        "payment_status": "completed",
        "payment_amount": 2.0,
        "enrolled_at": "2026-05-22T14:10:45.317189Z",
        "expires_at": "2185-05-22T14:10:45.317189Z",
        "created_at": "2026-05-22T11:40:35.846895Z",
        "last_watched_lesson_id": null
    },
    {
        "id": "36a5cf10-df83-4c04-9dae-800193f6b5d5",
        "user_id": "dca32ed6-1290-4c68-82d3-f3cb4c028f35",
        "course_id": "094fe62c-65a2-46de-9229-c2373cdab150",
        "course_title": "testing coupons",
        "course_slug": "testing coupons",
        "course_thumbnail_url": null,
        "status": "active",
        "enrollment_status": "active",
        "payment_status": "completed",
        "payment_amount": 1.0,
        "enrolled_at": "2026-05-22T13:45:45.724961Z",
        "expires_at": "2028-05-22T13:45:45.724961Z",
        "created_at": "2026-05-20T16:31:47.755703Z",
        "last_watched_lesson_id": null
    },
    {
        "id": "6b5343cc-0e3c-4da2-88a8-3bc339c8482b",
        "user_id": "dca32ed6-1290-4c68-82d3-f3cb4c028f35",
        "course_id": "7136110f-9312-499a-bc0b-1639e7fb4867",
        "course_title": "Mastering Agentic AI with Java: Spring AI, LangChain4j, MCP & ADK",
        "course_slug": "mastering agentic ai with java: spring ai, langchain4j, mcp & adk",
        "course_thumbnail_url": "https://d219k95tyhqd36.cloudfront.net/course-thumbnail/c3f0db27-d346-4572-a091-5dee78a95b8d.jpg",
        "status": "active",
        "enrollment_status": "active",
        "payment_status": "completed",
        "payment_amount": 0.0,
        "enrolled_at": "2026-05-11T17:33:03.699331Z",
        "expires_at": "2029-05-11T17:33:03.699331Z",
        "created_at": "2026-05-11T17:33:03.682084Z",
        "last_watched_lesson_id": null
    },
    {
        "id": "bc238bc8-a55b-4129-bf7f-5775ff3131a4",
        "user_id": "dca32ed6-1290-4c68-82d3-f3cb4c028f35",
        "course_id": "fe823541-8a94-451c-a237-42df538c8bd4",
        "course_title": "JUnit",
        "course_slug": "junit",
        "course_thumbnail_url": "https://d219k95tyhqd36.cloudfront.net/course-thumbnail/57eb0e39-e95a-489a-81b6-a01684f506af.png",
        "status": "active",
        "enrollment_status": "active",
        "payment_status": "completed",
        "payment_amount": 1.0,
        "enrolled_at": "2026-04-17T18:59:59.630726Z",
        "expires_at": "2029-04-17T18:59:59.630726Z",
        "created_at": "2026-04-07T05:11:16.958149Z",
        "last_watched_lesson_id": "2116dc09-0bd2-4093-bf31-dbe4857fb5c9"
    }
]

    page.route("**/*/my-courses", async route => {
        let response = await apiContext.fetch(route.request());
        route.fulfill({
            response,
            body: JSON.stringify(getCoursePayload)
         }) 

    }
    )

    page.route("**/*/courses/noauth/content/**", async route => {
        let response = await apiContext.fetch(route.request());
         const body = await response.json();
        updateAllPreviewFields(body);
        console.log("Modified response: " + JSON.stringify(body));
        route.fulfill({
            response,
            body: JSON.stringify(body)
         }) 

    }
    )
    await page.goto('https://staging.d1m26rxf2ish6y.amplifyapp.com/');
   // await expect(page.getByRole('link', { name: 'Telusko' })).toBeVisible();

    await page.getByRole('link', { name: 'Login' }).click();
   // await expect(page.locator('form').filter({ hasText: 'Sign inForgot password?' }).getByLabel('Continue with Google')).toBeVisible();

    await page.locator('form').filter({ hasText: 'Sign inForgot password?' }).getByPlaceholder('Email').click();
    await page.locator('form').filter({ hasText: 'Sign inForgot password?' }).getByPlaceholder('Email').fill('harshagitlab1@gmail.com');
    await page.locator('form').filter({ hasText: 'Sign inForgot password?' }).getByPlaceholder('Password').click();
    await page.locator('form').filter({ hasText: 'Sign inForgot password?' }).getByPlaceholder('Password').fill('Test@12345');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('link', { name: 'Telusko' })).toBeVisible();
    await page.locator("[href = '/my-courses']").click();
    await page.waitForResponse("**/*/my-courses");
    await page.pause();


})
