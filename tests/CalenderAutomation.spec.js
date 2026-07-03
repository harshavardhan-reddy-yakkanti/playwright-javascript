import {test, expect} from "@playwright/test";

test("Calender automation", async ({page}) => {
    let month = "March";
    let year = "2027";
    let date = "15";
    await page.goto("https://demoqa.com/date-picker");
    let dateInput = page.locator("#datePickerMonthYearInput");
    await dateInput.click();
    let monthDropdown = page.locator(".react-datepicker__month-select");
    await monthDropdown.selectOption(month);
    let yearDropdown = page.locator(".react-datepicker__year-select");
    await yearDropdown.selectOption(year);
    let dateLocator = page.locator(".react-datepicker__day");
    dateLocator.first().waitFor();
    console.log("COUNT:  "+await dateLocator.count());
    for (let i = 0; i < await dateLocator.count(); i++) {
        console.log(await dateLocator.nth(i).textContent());
        if (await dateLocator.nth(i).textContent() === date) {
            await dateLocator.nth(i).click();
            break;
        }   
    }

    let selectedDate = await dateInput.inputValue();
    let expectedDate = "";
    switch(month) {
        case "January":
            expectedDate = "01";
            break;
        case "February":
            expectedDate = "02";
            break;
        case "March":
            expectedDate = "03";
            break;
        case "April":
            expectedDate = "04";
            break;
        case "May":
            expectedDate = "05";
            break;
        case "June":
            expectedDate = "06";
            break;
        case "July":
            expectedDate = "07";
            break;  
        case "August":
            expectedDate = "08";
            break;  
        case "September":
            expectedDate = "09";
            break;
        case "October":
            expectedDate = "10";
            break;
        case "November":
            expectedDate = "11";
            break;
        case "December":
            expectedDate = "12";
            break;  
    }
    expectedDate += "/" + date + "/" + year;
    console.log("Selected Date: " + selectedDate);
    console.log("Expected Date: " + expectedDate);  
    expect(selectedDate).toBe(expectedDate);

})
