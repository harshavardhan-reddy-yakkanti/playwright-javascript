export class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.fields = page.locator('div.field');
        this.countryInput = page.locator("[placeholder='Select Country']");
        this.countryOptions = page.locator(".ta-results button");
        this.placeOrderBtn = page.locator("text=Place Order ");
    }

    async enterPaymentDetails(Name, CVV) {
        const count = await this.fields.count();
        for (let i = 0; i < count; i++) {

            const field =  await this.fields.nth(i);

            const title = await field.locator('.title').textContent();

            if (title.includes('CVV')) {

                await field.locator('input').fill(CVV);
            }
            if (title.includes('Name on Card')) {

                await field.locator('input').fill(Name);
            }
        }

        await this.countryInput.pressSequentially("Ind", { delay: 250 });
        await this.countryOptions.first().waitFor();
        for (let i = 0; i < await this.countryOptions.count(); i++) {
            if (await this.countryOptions.nth(i).textContent() === " India") {
                await this.countryOptions.nth(i).click();
                console.log("Country selected: India");
                break;

            }
        }

    }

    async clickPlaceOrder(){
        await this.placeOrderBtn.click();
    }
}