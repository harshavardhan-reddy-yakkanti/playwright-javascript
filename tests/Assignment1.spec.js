import { test, expect } from "@playwright/test";
var BASE_URL = "https://eventhub.rahulshettyacademy.com";

test("Assignment 1", async ({ page }) => {
    await page.goto(BASE_URL);
    var email = page.getByPlaceholder("you@email.com");
    await email.fill("yharsha0001@gmail.com");
    var password = page.getByLabel("Password");
    await password.fill("Yharsha0001@");
    var signBtn = page.locator("#login-btn");
    await signBtn.click();
    var username = page.getByTestId("user-email-display");
    var actualUsername = await username.textContent();
    console.log("Username: "+actualUsername);
    await expect(actualUsername).toBe("yharsha0001@gmail.com");

    var ManageEventBtn = page.locator("[href = '/admin/events']");
    await ManageEventBtn.click();
    var evenTitle = "Test Event " + Date.now();
    var titleField = page.locator(" #event-title-input");
    await titleField.fill(evenTitle);
    var description = page.locator(" #admin-event-form textarea");
    await description.fill("This is a test event created by Playwright automation script");
    var city = page.getByLabel("City");
    await city.fill("Hyderabad");
    var venue = page.getByLabel("Venue");
    await venue.fill("HITEC City");
    var EventDate = page.getByLabel("Event Date & Time");
    await EventDate.fill("2030-01-01T01:01");
    var price = page.getByLabel("Price ($)");
    await price.fill("100");
    var totalSeats = page.getByLabel("Total Seats");
    await totalSeats.fill("100");
    var submitEvent = page.getByTestId('add-event-btn')
    await submitEvent.click();

    // Verify if the event is created successfully
    var eventsLink = page.locator("a[href='/events']");
    await eventsLink.first().click();
    var evenCart = page.getByTestId("event-card");
    await evenCart.first().waitFor();
    var totalEvents = await evenCart.count();
    console.log("Total Events Found: "+totalEvents);
    var isMatchFound = false;
    var SeatsBeforeBooking;
    for (var i = 0; i < totalEvents; i++) {
        var eventName = await evenCart.nth(i).locator("h3").textContent();
        console.log("Actual Event Title: "+eventName);
        console.log("Expected Event Title ")
        if (eventName === evenTitle) {
            isMatchFound = true;
            var seatsText = await evenCart.nth(i).locator(".text-emerald-600").textContent();
            SeatsBeforeBooking = parseInt(seatsText.split(" ")[0]);
            console.log("SeatsBooking: "+SeatsBeforeBooking);
            var bookBtn = evenCart.nth(i).getByTestId("book-now-btn");
            await bookBtn.click();
            console.log("Match Found");
            break;
        }
    }
    await expect(isMatchFound).toBeTruthy();


    //Fill the booking form and submit
    var fullName = page.getByLabel("Full Name");
    await fullName.fill("Y Harsha Vardhan");
    var emailId = page.locator("#customer-email");
    await emailId.fill("yharsha0001@gmail.com");
    var phone = page.getByPlaceholder("+91 98765 43210");
    var confirmBtn = page.locator(".confirm-booking-btn");
    await phone.fill("9876543210");
    await confirmBtn.click();

    var bookRef = page.locator(".booking-ref");
    await expect(bookRef).toBeVisible();
    var bookingRefText = await bookRef.textContent();
    bookingRefText = bookingRefText.trim();
    console.log("Booking reference: " + bookingRefText);

    // Verify if the booking reference is displayed in My Bookings page
    var bookingsLink = page.locator("text = View My Bookings");
    await bookingsLink.click();
    var currentUrl = page.url();
    await expect(currentUrl).toBe(BASE_URL + "/bookings");

    var bookingCards = page.locator("#booking-card");
    await bookingCards.first().waitFor();
    var isBookingMatch = false;
    for (var i = 0; i < await bookingCards.count(); i++) {
        var bookingId = await bookingCards.nth(i).locator(".booking-ref").textContent();
        console.log("Actual Booking id "+i+bookingId);
        if (await bookingId === bookingRefText) {
           var expectedEventTitle=  await bookingCards.nth(i).locator("h3").textContent();
           await expect(expectedEventTitle).toBe(evenTitle);
            isBookingMatch = true;
            break;
        }

    }

await expect(isBookingMatch).toBeTruthy();

//Valiadate seat reduction
eventsLink.first().click();

    await evenCart.first().waitFor();
    var totalEvents = await evenCart.count();
    console.log("Total Events Found: "+totalEvents);
    var isMatchFound = false;
    for (var i = 0; i < totalEvents; i++) {
        var eventName = await evenCart.nth(i).locator("h3").textContent();
        console.log("Actual Event Title: "+eventName);
        console.log("Expected Event Title ")
        if (eventName === evenTitle) {
            isMatchFound = true;
            var seatsText = await evenCart.nth(i).locator(".text-emerald-600").textContent();
            let afterSeatBookings = parseInt(seatsText.split(" ")[0]);
            console.log("SeatsBooking: "+afterSeatBookings);
            console.log("Match Found");
            expect(afterSeatBookings).toBe(SeatsBeforeBooking-1);
            break;
        }
    }
    await expect(isMatchFound).toBeTruthy();


})
