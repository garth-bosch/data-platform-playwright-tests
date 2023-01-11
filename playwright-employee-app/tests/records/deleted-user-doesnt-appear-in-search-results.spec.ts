import {test} from '../../src/base/base-test';
import {
  EMPLOYEE_SESSION,
  TestRecordTypes,
} from '@opengov/cit-base/build/constants/cit-constants';
import {expect} from '@playwright/test';
import {faker} from '@faker-js/faker';

test.use({storageState: EMPLOYEE_SESSION});
test.describe('Employee App - Search @users @search', () => {
  let user: {
    firstName: string;
    lastName: string;
    email: string;
  };

  test(
    'Deleted users without any records should not show up in the applicants search results' +
      '@OGT-34474 @broken_test @known_defect @PLCE-1897',
    async ({
      page,
      employeeAppUrl,
      navigationBarPage,
      commonApi,
      selectRecordTypePage,
      createRecordPage,
    }) => {
      user = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
      };

      await test.step('Create a new user via API', async () => {
        await commonApi.createUser(user.firstName, user.lastName, user.email);
      });

      await test.step('Login to EA and start a record draft', async () => {
        await page.goto(employeeAppUrl);
        await navigationBarPage.validateOpenGovLogoVisibility(true);
        await navigationBarPage.clickCreateRecordButton();
        await selectRecordTypePage.selectRecordType(
          TestRecordTypes.Record_Steps_Test.name,
        );
      });

      await test.step('Start adding an applicant and search for the user', async () => {
        await createRecordPage.clickAddApplicantBtn();
        await createRecordPage.searchForUser(
          `${user.firstName} ${user.lastName}`,
        );
        await createRecordPage.waitTillSearchSpinnerDisappears();
      });

      await test.step('Verify the user name appears in search results', async () => {
        await expect(
          createRecordPage.page.locator(
            createRecordPage.elements.searchAndSelectButton.selector(
              user.email,
            ),
          ),
        ).toBeVisible();
      });

      await test.step('Close the draft page and delete the new user via API', async () => {
        await page.reload();
        await commonApi.deleteUser(user.email);
      });

      await test.step('Start a new record draft', async () => {
        await navigationBarPage.clickCreateRecordButton();
        await selectRecordTypePage.selectRecordType(
          TestRecordTypes.Record_Steps_Test.name,
        );
      });

      await test.step('Start adding an applicant and search for the user', async () => {
        await createRecordPage.clickAddApplicantBtn();
        await createRecordPage.searchForUser(
          `${user.firstName} ${user.lastName}`,
        );
        await createRecordPage.waitTillSearchSpinnerDisappears();
      });

      await test.step('Verify the user does not appear in search results anymore', async () => {
        await expect(
          createRecordPage.page.locator(
            createRecordPage.elements.searchAndSelectButton.selector(
              user.email,
            ),
          ),
        ).toBeHidden({timeout: 5000});
      });
    },
  );

  test.afterEach(async ({commonApi}) => {
    await test.step('Delete the new user via API', async () => {
      await commonApi.deleteUser(user.email);
    });
  });
});
