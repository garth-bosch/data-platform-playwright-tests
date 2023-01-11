import {test, expect} from '../../src/base/base-test';
import {faker} from '@faker-js/faker';

test.describe('Storefront - Login @login', () => {
  test.beforeEach(async ({storeFrontLoginPage}) => {
    await storeFrontLoginPage.goto();
    await storeFrontLoginPage.selectSecureLoginPortalButton();
  });

  test('Login failed with invalid username and valid password on storefront portal @OGT-34306', async ({
    authPage,
    baseConfig,
    storeFrontUserPage,
  }) => {
    await test.step('Login with invalid email', async () => {
      await authPage.fillEmailField(faker.internet.email());
      await authPage.fillPasswordField(baseConfig.citTestData.citAppPassword);
      await authPage.clickLogin();
    });

    await test.step('Error message is shown', async () => {
      await authPage.validateLoginFailureToastIsVisible();
      await storeFrontUserPage.validateMyAccountButtonVisibility(false);
    });
  });

  test('Login failed with valid username and invalid password on storefront portal @OGT-34307', async ({
    authPage,
    baseConfig,
    storeFrontUserPage,
  }) => {
    await test.step('Login with invalid password', async () => {
      await authPage.fillEmailField(baseConfig.citTestData.citCitizenEmail);
      await authPage.fillPasswordField(faker.internet.password());
      await authPage.clickLogin();
    });

    await test.step('Error message is shown', async () => {
      await authPage.validateLoginFailureToastIsVisible();
      await storeFrontUserPage.validateMyAccountButtonVisibility(false);
    });
  });

  test('Login successful with valid username and password on storefront portal @OGT-34305', async ({
    authPage,
    baseConfig,
    storeFrontUserPage,
  }) => {
    await test.step('Login with valid credentials', async () => {
      await authPage.fillEmailField(baseConfig.citTestData.citCitizenEmail);
      await authPage.fillPasswordField(baseConfig.citTestData.citAppPassword);
      await authPage.clickLogin();
    });

    await test.step('Home page is shown', async () => {
      await storeFrontUserPage.validateMyAccountButtonVisibility(true);
    });
  });

  test('User stays logged in after refreshing storefront home page @OGT-34309', async ({
    authPage,
    storeFrontUserPage,
  }) => {
    await test.step('Login as citizen', async () => {
      await authPage.loginAsCitizen();
      await storeFrontUserPage.validateMyAccountButtonVisibility(true);
    });

    await test.step('Session is maintained after refresh', async () => {
      await authPage.page.reload();
      await expect(
        authPage.page.locator(authPage.elements.logoutButton),
      ).toBeHidden();
      await storeFrontUserPage.validateMyAccountButtonVisibility(true);
    });
  });

  test('Validate username and password fields cleared when logging out of storefront portal @OGT-34308', async ({
    authPage,
    storeFrontUserPage,
    storeFrontLoginPage,
  }) => {
    await test.step('Login as citizen', async () => {
      await authPage.loginAsCitizen();
    });

    await test.step('Login fields are reset after logout', async () => {
      await storeFrontUserPage.logout();
      await storeFrontLoginPage.clickLoginLink();
      await storeFrontLoginPage.selectSecureLoginPortalButton();
      await authPage.validateEmailAndPasswordFieldsAreEmpty();
    });
  });
});
