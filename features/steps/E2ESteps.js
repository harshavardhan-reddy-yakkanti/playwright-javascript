import {Given, When, Then} from '@cucumber/cucumber';
import { PageObjectManager } from "../../utils/PageObjectManager.js";
import * as playwright from 'playwright';



Given('the user opens the Rahul Shetty Academy client application',async function () {
 this.loginPage = this.poManager.getLoginPage();
 await this.loginPage.launchUrl();
});

Given('User logins with username {string} and password {string}', async function (emailId, password) {
 await this.loginPage.login(emailId, password);
});

When('the user selects {string} and adds it to the cart', async function (productName) {
  this.productName = productName;
  this.dashboardPage = this.poManager.getDashboardPage();
  await this.dashboardPage.addToCart(this.productName);
  
});

When('the user navigates to cart and proceeds to checkout',async function () {
  this.dashboardPage.navigateToCartPage();
  this.cartPage = this.poManager.getCartPage();
  await this.cartPage.validateItemAddedToCart(this.productName);
  await this.cartPage.clickOnCheckout();
});

When('the user enters payment details and selects country {string}', async function (country) {
  this.checkoutPage = this.poManager.getCheckoutPage();
  const CVV = "123";
  const Name = "Harsha";
  await this.checkoutPage.enterPaymentDetails(Name, CVV);
  await this.checkoutPage.clickPlaceOrder();
});

Then('the user should successfully place the order and verify it in My Orders', async function () {
  this.orderPage = this.poManager.getOrderPage();
  await this.orderPage.validateOrderPlaced();
  await this.orderPage.validateOrderinOrderHistoryPage();
});
