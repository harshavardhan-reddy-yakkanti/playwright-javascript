import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://staging.d1m26rxf2ish6y.amplifyapp.com/auth');
  await expect(page.locator('form').filter({ hasText: 'Sign inForgot password?' }).getByLabel('Continue with Google')).toBeVisible();

  await page.getByRole('button', { name: 'Sign up' }).nth(1).click();
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('Perf test');
  await page.locator('input[type="email"]').fill('teluskotesting+0001@gmail.com');
  await page.locator('form').filter({ hasText: 'Sign upPassword should' }).getByPlaceholder('Password').fill('Test@12345');
  await page.getByRole('button', { name: 'Sign up' }).first().click();
});