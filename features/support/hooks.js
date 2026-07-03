import {Before, After, AfterStep,Status} from "@cucumber/cucumber";
import { PageObjectManager } from "../../utils/PageObjectManager.js";
import * as playwright from 'playwright';
import {setDefaultTimeout} from '@cucumber/cucumber';
setDefaultTimeout(60000);


Before(async function () {
      this.browser = await playwright.chromium.launch({
        headless: false
      });
    
      const context = await this.browser.newContext();
      this.page = await context.newPage();
     this.poManager = new PageObjectManager(this.page);
  
});

AfterStep(async function ({ result }) {
    console.log("AfterStep hook executed");
  if (result.status === Status.FAILED) {
    console.log("Step failed, taking screenshot...");
    await this.page.screenshot({
      path: `failure-${Date.now()}.png`
    });
  }
});

After(async function ({ result }) {   
  console.log("Ater hook status: " + result.status);
    console.log("After hook executed");
    await this.browser.close();
});