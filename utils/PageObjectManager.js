import {
  LoginPage,
  DashboardPage,
  CheckoutPage,
  OrderPage,
  CartPage
} from "../tests/pages/index.js";

export class PageObjectManager {
  constructor(page) {
    this.page = page;

    this.loginPage = new LoginPage(page);
    this.dashboardPage = new DashboardPage(page);
    this.checkoutPage = new CheckoutPage(page);
    this.orderPage = new OrderPage(page);
    this.cartPage = new CartPage(page);
  }

  getLoginPage() {
    return this.loginPage;
  }

  getDashboardPage() {
    return this.dashboardPage;
  }

  getCheckoutPage() {
    return this.checkoutPage;
  }

  getOrderPage() {
    return this.orderPage;
  }

  getCartPage() {
    return this.cartPage;
  }
}