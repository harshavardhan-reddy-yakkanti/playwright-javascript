export class CartPage{
    constructor(page){
        this.page = page;
        this.cartItems = page.locator(".cartSection h3");
        this.checkoutBtn = page.locator("text=Checkout");
    }

    async validateItemAddedToCart(productName){
        for (let i = 0; i < await this.cartItems.count(); i++) {
        if (await this.cartItems.nth(i).textContent() === productName) {
            console.log("Product is present in cart: " + await this.cartItems.nth(i).textContent());
            break;
        }
    }

    }

    async clickOnCheckout(){
        await this.checkoutBtn.click();
    }
}