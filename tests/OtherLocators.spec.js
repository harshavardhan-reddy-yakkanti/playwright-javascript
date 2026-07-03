import {test, expect} from "@playwright/test";

test("Other locators", async ({page}) => {  
    await page.goto("https://rahulshettyacademy.com/locatorspractice/");
    let nameInput = page.getByPlaceholder("Username");
    await nameInput.fill("rahulshettyacademy");
    let passwordInput = page.getByPlaceholder("Password");
    passwordInput.fill("learning");
    let rememberMeCheckbox = page.getByLabel(" Remember my username");
    await rememberMeCheckbox.click();
    let termsAndConditionsCheckbox = page.getByLabel(" I agree to the ");
    await termsAndConditionsCheckbox.click();
    let signInButton = page.getByRole("button", {name: "Sign In"});
    await signInButton.click();
    let errorMessage = page.getByText("* Incorrect username or passworq");
    await expect(errorMessage).toBeVisible();



})