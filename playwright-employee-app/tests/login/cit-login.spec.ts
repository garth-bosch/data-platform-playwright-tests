import {faker} from '@faker-js/faker';
import {expect, test} from '../../src/base/base-test';
import {baseConfig} from '@opengov/cit-base/build';

test.describe('Login employee portal', () => {
  test('Login failed with invalid username and password on employee portal @OGT-33557', async ({
    page,
    employeeAppUrl,
    authPage,
  }) => {
    await test.step('Navigate to Employee Portal', async () => {
      await page.goto(employeeAppUrl, {waitUntil: 'networkidle'});
    });
    await test.step('Log in with invalid credentials', async () => {
      await authPage.fillEmailField(
        `invalidpass${faker.random.alphaNumeric(3)}@opengov.com`,
      );
      await authPage.fillPasswordField('badpass');
      await authPage.clickLogin();
    });

    await test.step('Verify error message is displayed', async () => {
      let text = '';
      await expect
        .poll(
          async () => {
            text = await authPage.page
              .locator('.auth0-global-message-error span span')
              .innerText();
            return text.match(new RegExp('WRONG EMAIL OR PASSWORD.'));
          },
          {
            message:
              'Expected error text "WRONG EMAIL OR PASSWORD." but got ' + text,
            timeout: 5000,
          },
        )
        .toBeTruthy();
    });
  });

  test('Validate username and password fields cleared when logging out of employee portal @OGT-33559', async ({
    page,
    employeeAppUrl,
    authPage,
    navigationBarPage,
  }) => {
    await test.step('Navigate to Employee Portal', async () => {
      await page.goto(employeeAppUrl, {waitUntil: 'networkidle'});
    });
    await test.step('Login with valid credentials', async () => {
      await authPage.fillEmailField(baseConfig.citTestData.citEmployeeEmail);
      await authPage.fillPasswordField(baseConfig.citTestData.citAppPassword);
      await authPage.clickLogin();
    });

    await test.step('Logout and verify fields cleared', async () => {
      await navigationBarPage.logout();
      await authPage.validateEmailAndPasswordFieldsAreEmpty();
    });
  });
});
