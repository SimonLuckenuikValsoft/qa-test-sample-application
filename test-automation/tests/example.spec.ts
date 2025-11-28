import { test, expect } from '@playwright/test';

// GitHub Pages URL for the Support Ticket Desk application
const BASE_URL = 'https://simonluckenuikvalsoft.github.io/qa-test-sample-application/';

test('has title', async ({ page }) => {
  await page.goto(BASE_URL);

  // Expect the page to load successfully
  await expect(page).toHaveTitle(/Support Ticket Desk/);
});

test('login page is displayed', async ({ page }) => {
  await page.goto(BASE_URL);

  // Expect login form elements to be visible
  await expect(page.getByTestId('login-username')).toBeVisible();
  await expect(page.getByTestId('login-password')).toBeVisible();
  await expect(page.getByTestId('login-submit')).toBeVisible();
});
