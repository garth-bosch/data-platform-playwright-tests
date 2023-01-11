import {test, expect} from '../../src/base/base-test';

test.describe('Storefront - Claim Record @claim_record', () => {
  //TODO Enable after ESN-4911 fix
  test('Claim record link redirects user to Login page @OGT-45158 @smoke @known_defect @ESN-4911', async ({
    authPage,
    page,
    storeFrontUserPage,
    storefrontUrl,
  }) => {
    await test.step('User lands on Storefront and claims record', async () => {
      await page.goto(storefrontUrl);
      await storeFrontUserPage.clickClaimRecord();
    });

    await test.step('User is then re-directed to login page.', async () => {
      await expect(page.locator(authPage.elements.loginButton)).toBeVisible();
    });

    await test.step('User is taken to claim record page after login.', async () => {
      await authPage.loginAsCitizen();
      await expect(
        page.locator(storeFrontUserPage.elements.myAccountButton),
      ).toBeVisible();
      expect(page.url()).toContain('/claimRecord');
      await expect(
        page.locator(storeFrontUserPage.elements.claimRecordButton),
      ).toBeVisible();
    });
  });
});
