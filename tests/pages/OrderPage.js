import { expect } from "@playwright/test";
export class OrderPage {

    constructor(page) {
        this.page = page;
        this.orderConfirmation = page.locator(".hero-primary");
        this.orderIds = page.locator("tr.ng-star-inserted label");
        this.myOrdersBtn  = page.locator("[routerlink='/dashboard/myorders']");
        this.orderTableRows = page.locator("tbody tr th");
    }

    async validateOrderPlaced() {
        await expect(this.orderConfirmation).toHaveText("Thankyou for the order.");
    }

    async validateOrderinOrderHistoryPage() {
        let orders = new Array();
        for (let i = 0; i < await this.orderIds.count(); i++) {
            const orderText = await this.orderIds.nth(i).textContent();
            const cleanOrderId = orderText.replace(/\|/g, "").trim();
            orders.push(cleanOrderId);
            break;
        }
        console.log("Order ID stored for verification: " + orders[0]);
        await this.myOrdersBtn.first().click();
        await this.orderTableRows.first().waitFor();
        let testPassed = false;
            for (let i = 0; i < await this.orderTableRows.count(); i++) {
                let rowText = await this.orderTableRows.nth(i).textContent();
                if(rowText.includes(orders[0])){
                    console.log("Order ID found in My Orders: " + rowText);
                    testPassed = true;
                    break;
                }
               console.log("Order ID verified in My Orders: " + await this.orderTableRows.nth(i).textContent());
            }
            expect(testPassed).toBeTruthy();
    }
}