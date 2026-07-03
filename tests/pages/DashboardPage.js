export class DashboardPage {
    constructor(page) {
        this.page = page;
        this.products = page.locator(".card-body");
        this.productHeadingSelector = "h5 b";
        this.cart = page.locator("[routerlink*='cart']");
    }

    async addToCart(productName) {
        await this.products.first().waitFor();
        let productCount = await this.products.count();
        console.log("Total products: " + productCount);
        for (let i = 0; i < await productCount; i++) {
            await console.log("Product name: " + await this.products.nth(i).locator(this.productHeadingSelector).textContent());
            if (await this.products.nth(i).locator(this.productHeadingSelector).textContent() === productName) {
                await this.products.nth(i).locator("text= Add To Cart").click();
                console.log("Product added to cart: " + await this.products.nth(i).locator(this.productHeadingSelector).textContent());
                break;
            }
        }
    }

    async navigateToCartPage() {
        await this.cart.click();
    }
}