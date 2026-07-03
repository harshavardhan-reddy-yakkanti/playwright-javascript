import { PageObjectManager } from "../utils/PageObjectManager";
import {test} from "@playwright/test";
import orderTestData from '../testData/placeOrderTestData.json' assert { type: 'json' };


console.log("Loaded JSON:", orderTestData);

test.describe.configure({mode:"parallel"})

 for(const data of orderTestData){
test(`@Smoke POM structure for ${data.productName}`, async ({page}) =>{

    const poManager = new PageObjectManager(page);
    const loginPage = poManager.getLoginPage();
    const dashboardPage = poManager.getDashboardPage();
    const cartPage = poManager.getCartPage();
    const checkoutPage = poManager.getCheckoutPage();
    const orderPage = poManager.getOrderPage();
    const email = data.emailId;
    const password = data.password;
    const productName = data.productName;
    const CVV = "123";
    const Name = "Harsha";

    await loginPage.launchUrl();
    await loginPage.login(email,password);
    await dashboardPage.addToCart(productName);
    await dashboardPage.navigateToCartPage();
    await cartPage.validateItemAddedToCart(productName);
    await cartPage.clickOnCheckout();
    await checkoutPage.enterPaymentDetails(Name,CVV);
    await checkoutPage.clickPlaceOrder();
    await orderPage.validateOrderPlaced();
    await orderPage.validateOrderinOrderHistoryPage();


});
}