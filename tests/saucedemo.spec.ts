import { test, expect, Page } from '@playwright/test';

const credentials = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  lockedOut: { username: 'locked_out_user', password: 'secret_sauce' },
  invalid: { username: 'standard_user', password: 'wrong_password' }
};

const selectors = {
  username: '#user-name',
  password: '#password',
  loginButton: '#login-button',
  errorBanner: '[data-test="error"]',
  sortSelect: '.product_sort_container',
  inventoryItem: '.inventory_item',
  inventoryName: '.inventory_item_name',
  addToCartButton: 'button[data-test^="add-to-cart"]',
  cartLink: '.shopping_cart_link',
  cartItemName: '.cart_item_label .inventory_item_name',
  checkoutButton: '[data-test="checkout"]',
  firstName: '[data-test="firstName"]',
  lastName: '[data-test="lastName"]',
  postalCode: '[data-test="postalCode"]',
  continueButton: '[data-test="continue"]',
  finishButton: '[data-test="finish"]',
  completeHeader: '.complete-header',
  pageHeader: '.header_secondary_container',
  pageFooter: '.footer'
};

async function login(page: Page, username: string, password: string) {
  await page.goto('/');
  await page.fill(selectors.username, username);
  await page.fill(selectors.password, password);
  await page.click(selectors.loginButton);
}

async function addItemByPosition(page: Page, position: number) {
  const item = page.locator(selectors.inventoryItem).nth(position);
  const name = await item.locator(selectors.inventoryName).innerText();
  await item.locator(selectors.addToCartButton).click();
  return name.trim();
}

test.describe('Sauce Demo end-to-end', () => {
  test('locked_out_user cannot log in', async ({ page }) => {
    await login(page, credentials.lockedOut.username, credentials.lockedOut.password);
    await expect(page.locator(selectors.errorBanner)).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });

  test('standard_user can log in successfully and sees header/footer', async ({ page }) => {
    await login(page, credentials.standard.username, credentials.standard.password);
    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator(selectors.pageHeader)).toBeVisible();
    await expect(page.locator(selectors.pageFooter)).toBeVisible();
  });

  test('shows an appropriate error message for failed login', async ({ page }) => {
    await login(page, credentials.invalid.username, credentials.invalid.password);
    await expect(page.locator(selectors.errorBanner)).toHaveText(
      'Epic sadface: Username and password do not match any user in this service.'
    );
  });

  test('standard_user can purchase products and complete checkout', async ({ page }) => {
    await login(page, credentials.standard.username, credentials.standard.password);
    await expect(page).toHaveURL(/inventory.html/);

    await page.selectOption(selectors.sortSelect, { label: 'Price (low to high)' });
    const inventoryCount = await page.locator(selectors.inventoryItem).count();
    const lastProductName = await addItemByPosition(page, inventoryCount - 1);

    await page.selectOption(selectors.sortSelect, { label: 'Name (A to Z)' });
    const firstProductName = await addItemByPosition(page, 0);

    await page.click(selectors.cartLink);
    await expect(page.locator(selectors.cartItemName)).toHaveCount(2);

    const cartItems = await page.locator(selectors.cartItemName).allTextContents();
    expect(cartItems.map((text) => text.trim()).sort()).toEqual(
      [firstProductName, lastProductName].sort()
    );

    await page.click(selectors.checkoutButton);
    await page.fill(selectors.firstName, 'Jane');
    await page.fill(selectors.lastName, 'Doe');
    await page.fill(selectors.postalCode, '90210');
    await page.click(selectors.continueButton);

    const overviewItems = await page.locator(selectors.cartItemName).allTextContents();
    expect(overviewItems.map((text) => text.trim()).sort()).toEqual(
      [firstProductName, lastProductName].sort()
    );

    await page.click(selectors.finishButton);
    await expect(page.locator(selectors.completeHeader)).toHaveText('THANK YOU FOR YOUR ORDER');
  });
});
