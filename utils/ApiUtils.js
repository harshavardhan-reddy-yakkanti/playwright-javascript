import {expect} from "@playwright/test"
export class ApiUtils{

    constructor(apiContext,loginPayload){
        this.apiContext = apiContext
        this.loginPayload = loginPayload
    }

    async getToken(){
        let response = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
                {
                    data: this.loginPayload
                }
        
            )
            await expect(response.ok()).toBeTruthy();
            let jsonResponse = await response.json();
            let token = await jsonResponse.token;
        return token;
    }

    async addtoCart(token,cartPayload){
            console.log("Token: --> "+token)
            let headersData = {
                "Authorization": token,
                "Content-type" : "application/json"
            }
            let addToCartResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/user/add-to-cart",
                {
                    data: cartPayload,
                    headers: headersData
                }
            );
            console.log("Response code: " + await addToCartResponse.status());
            let cartResponse = await addToCartResponse.json();
        
            console.log("Add to cart response: " + cartResponse.message);

    }

    async placeOrder(token,orderPayload){
        let headersData = {
            "Authorization": token,
            "Content-type" : "application/json"
        }
        let placeOrderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
            {
                data: orderPayload,
                headers: headersData
            }
        );
        console.log("Response code: " + await placeOrderResponse.status());
        let orderResponse = await placeOrderResponse.json();
        console.log("Place order response: " + orderResponse.message);
        return orderResponse.orders[0];
    }
}