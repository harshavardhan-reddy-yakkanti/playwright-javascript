export class LoginPage{
    // @ts-ignore
    constructor(page){
    this.page = page;
    this.emailField =  page.locator("#userEmail");
    this.passwordField =  page.locator("#userPassword")
    this.loginBtn =  page.locator("#login")
    }

    async launchUrl(){
           await  this.page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    }

    // @ts-ignore
    async login(email,password){
       await this.page.waitForTimeout(5000);
        await this.emailField.fill(email);
        await this.passwordField.fill(password);
        await this.loginBtn.click();
    }

}