import {test} from '../../src/base/base-test';

test.describe('Storefront - Login @login @signup', () => {
  test.beforeEach(async ({storeFrontLoginPage}) => {
    await storeFrontLoginPage.goto();
  });
  test('Citizen can signup from storefront main page @OGT-45470 @smoke', async ({
    signupPage,
    storeFrontUserPage,
  }) => {
    await test.step('Citizen goes to signup page', async () => {
      await storeFrontUserPage.clickSignupButton();
    });

    await test.step('Citizen signs up on storefront', async () => {
      await signupPage.fillAndSubmitEmailPasswordForSignup();
    });

    await test.step('New user logs out', async () => {
      await storeFrontUserPage.logout();
    });
  });
});
